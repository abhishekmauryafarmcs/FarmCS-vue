const INDIA_DATA_PATH = '../India-map-cropdata/india.json';
const CROPS_DATA_PATH = '../India-map-cropdata/df2013.csv';
const STATE_PRODUCTION_PATH = '../India-map-cropdata/state_crop_production.csv';
const DISTRICT_ANALYSIS_PATH = '../all-graph-data/graphdata2013.csv';

const hamburger = document.querySelector('.hamburger-menu');
const navLinks = document.querySelector('.nav-links');

hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks?.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!hamburger?.contains(e.target) && !navLinks?.contains(e.target)) {
        hamburger?.classList.remove('active');
        navLinks?.classList.remove('active');
    }
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger?.classList.remove('active');
        navLinks?.classList.remove('active');
    });
});

async function loadCropsList() {
    try {
        const response = await fetch(CROPS_DATA_PATH);
        if (!response.ok) throw new Error('Failed to load crops data');

        const csvText = await response.text();
        const lines = csvText.split('\n').slice(1);
        const uniqueCrops = new Set();

        lines.forEach(line => {
            if (line) {
                const columns = line.split(',');
                if (columns.length >= 5) {
                    const crop = columns[4].trim();
                    if (crop) uniqueCrops.add(crop);
                }
            }
        });

        const sortedCrops = Array.from(uniqueCrops).sort();
        const cropsList = document.querySelector('.crops-items');
        cropsList.innerHTML = sortedCrops.map(crop => `<li>${crop}</li>`).join('');
    } catch (error) {
        console.error('Error loading crops:', error);
        document.querySelector('.crops-items').innerHTML = '<li style="color: red;">Error loading crops data</li>';
    }
}

async function createIndiaMap() {
    try {
        const [geoResponse, dataResponse] = await Promise.all([
            fetch(INDIA_DATA_PATH),
            fetch(STATE_PRODUCTION_PATH)
        ]);

        if (!geoResponse.ok || !dataResponse.ok) throw new Error('Failed to load map or data');

        const indiaData = await geoResponse.json();
        const productionText = await dataResponse.text();
        const productionData = {};

        productionText.split('\n').slice(1).forEach(line => {
            if (line) {
                const [state, production] = line.split(',');
                productionData[state.trim()] = parseFloat(production);
            }
        });

        d3.select('#indiaMap').html('');
        const container = document.getElementById('indiaMap');
        const width = container.clientWidth;
        const height = container.clientHeight;
        const scale = Math.min(width, height) * (window.innerWidth > 1200 ? 1.3 : 1.1);

        const svg = d3.select('#indiaMap')
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet');

        const projection = d3.geoMercator()
            .center([82, 23])
            .scale(scale)
            .translate([width / 2, height / 2]);

        const path = d3.geoPath().projection(projection);
        const colorScale = d3.scaleSequential().domain([0, 12]).interpolator(d3.interpolateYlGn);

        const tooltip = d3.select('#indiaMap')
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        const mapGroup = svg.append('g').attr('class', 'map-group');

        mapGroup.selectAll('path')
            .data(indiaData.features)
            .enter()
            .append('path')
            .attr('class', 'state')
            .attr('d', path)
            .style('fill', d => {
                const production = productionData[d.properties.st_nm];
                return production !== undefined ? colorScale(production) : '#e0e0e0';
            })
            .style('stroke-width', '0.5px')
            .on('mouseover', function (event, d) {
                const production = productionData[d.properties.st_nm];
                d3.select(this).style('fill', '#2E7D32').style('stroke-width', '1px');
                tooltip.transition().duration(200).style('opacity', .9);
                tooltip.html(`<strong>${d.properties.st_nm}</strong><br/>Production: ${production !== undefined ? production.toFixed(1) : 'N/A'}%`)
                    .style('left', `${event.clientX}px`)
                    .style('top', `${event.clientY}px`);
            })
            .on('mousemove', function (event) {
                tooltip.style('left', `${event.clientX}px`).style('top', `${event.clientY}px`);
            })
            .on('mouseout', function (d) {
                d3.select(this)
                    .style('fill', d => {
                        const production = productionData[d.properties.st_nm];
                        return production !== undefined ? colorScale(production) : '#e0e0e0';
                    })
                    .style('stroke-width', '0.5px');
                tooltip.transition().duration(500).style('opacity', 0);
            });
    } catch (error) {
        console.error('Error creating map:', error);
        document.getElementById('indiaMap').innerHTML = '<div style="color:red;text-align:center;padding:20px;">Error loading map data.<br>' + error.message + '</div>';
    }
}

async function loadDistrictAnalysis() {
    try {
        const response = await fetch(DISTRICT_ANALYSIS_PATH);
        if (!response.ok) throw new Error('Failed to load data');

        const csvText = await response.text();
        const data = csvText.split('\n').slice(1).map(line => {
            if (!line) return null;
            const [state, district, , season, , , production] = line.split(',');
            return {
                state: state?.trim(),
                district: district?.trim(),
                season: season?.trim(),
                production: parseFloat(production)
            };
        }).filter(item => item && item.state && item.district && !isNaN(item.production));

        const states = [...new Set(data.map(item => item.state))].sort();
        const stateSelect = document.getElementById('stateSelect');
        const seasonSelect = document.getElementById('seasonSelect');
        const graphSelect = document.getElementById('graphSelect');

        stateSelect.innerHTML = `<option value="">Select a State</option>${states.map(state => `<option value="${state}">${state}</option>`).join('')}`;

        async function updateChart() {
            const selectedState = stateSelect.value;
            if (!selectedState) return;
            const selectedSeason = seasonSelect.value;
            const selectedGraph = graphSelect.value;

            const filteredData = data.filter(item => {
                const seasonMatch = selectedSeason === 'Whole Year' ?
                    (item.season.includes('Kharif') || item.season.includes('Rabi')) :
                    item.season.includes(selectedSeason);
                return item.state === selectedState && seasonMatch;
            });

            const districtProduction = {};
            filteredData.forEach(item => {
                districtProduction[item.district] = (districtProduction[item.district] || 0) + item.production;
            });

            const sortedDistricts = Object.entries(districtProduction)
                .map(([district, production]) => ({ district, production }))
                .sort((a, b) => b.production - a.production);

            let chartData, layout;
            const seasonText = selectedSeason === 'Whole Year' ? 'Annual' : selectedSeason;

            switch (selectedGraph) {
                case 'piechart': {
                    const top10Districts = sortedDistricts.slice(0, 10);
                    const otherDistricts = sortedDistricts.slice(10);
                    const otherProduction = otherDistricts.reduce((sum, d) => sum + d.production, 0);
                    const pieData = [...top10Districts];
                    if (otherDistricts.length > 0) pieData.push({ district: 'Others', production: otherProduction });
                    chartData = [{
                        values: pieData.map(d => d.production),
                        labels: pieData.map(d => d.district),
                        type: 'pie',
                        hole: 0.4,
                        textinfo: 'label+percent'
                    }];
                    layout = {
                        title: `Top Districts by ${seasonText} Production in ${selectedState}`,
                        height: 600,
                        showlegend: true
                    };
                    break;
                }
                case 'barchart': {
                    const top15Districts = sortedDistricts.slice(0, 15);
                    chartData = [{
                        x: top15Districts.map(d => d.district),
                        y: top15Districts.map(d => d.production),
                        type: 'bar',
                        marker: { color: '#2E7D32' }
                    }];
                    layout = {
                        title: `Top Districts by ${seasonText} Production in ${selectedState}`,
                        xaxis: { title: 'District', tickangle: -45 },
                        yaxis: { title: 'Total Production', tickformat: '.2s' },
                        height: 600,
                        margin: { b: 100, l: 80, r: 30, t: 50 }
                    };
                    break;
                }
                case 'sunburst': {
                    const totalProduction = sortedDistricts.reduce((sum, d) => sum + d.production, 0);
                    const labels = ['Total', selectedState];
                    const parents = ['', 'Total'];
                    const values = [totalProduction, totalProduction];
                    sortedDistricts.forEach(d => {
                        labels.push(d.district);
                        parents.push(selectedState);
                        values.push(d.production);
                    });
                    chartData = [{
                        type: 'sunburst',
                        labels,
                        parents,
                        values,
                        branchvalues: 'total'
                    }];
                    layout = {
                        title: `${seasonText} District Production Distribution in ${selectedState}`,
                        height: 550,
                        width: 550,
                        margin: { l: 0, r: 0, b: 0, t: 50 },
                        showlegend: false
                    };
                    break;
                }
            }

            Plotly.newPlot('districtChart', chartData, layout, {
                responsive: true,
                displayModeBar: false
            });
        }

        stateSelect.addEventListener('change', updateChart);
        seasonSelect.addEventListener('change', updateChart);
        graphSelect.addEventListener('change', updateChart);
    } catch (error) {
        console.error('Error loading district analysis:', error);
        document.getElementById('districtChart').innerHTML = '<div style="color:red;text-align:center;padding:20px;">Error loading district analysis data.<br>' + error.message + '</div>';
    }
}

const darkModeToggle = document.getElementById('darkModeToggle');
const darkModeIcon = darkModeToggle.querySelector('i');

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const enabled = document.body.classList.contains('dark-mode');
    darkModeIcon.classList.toggle('fa-sun', enabled);
    darkModeIcon.classList.toggle('fa-moon', !enabled);
    localStorage.setItem('cropDataDarkMode', enabled ? 'enabled' : 'disabled');
}

function checkDarkModePreference() {
    const enabled = localStorage.getItem('cropDataDarkMode') === 'enabled';
    document.body.classList.toggle('dark-mode', enabled);
    darkModeIcon.classList.toggle('fa-sun', enabled);
    darkModeIcon.classList.toggle('fa-moon', !enabled);
}

darkModeToggle.addEventListener('click', toggleDarkMode);
document.addEventListener('DOMContentLoaded', () => {
    checkDarkModePreference();
    loadCropsList();
    createIndiaMap();
    loadDistrictAnalysis();
});

window.addEventListener('resize', createIndiaMap);
