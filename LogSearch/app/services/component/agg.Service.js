(function () {
    'use strict';
    var serviceId = 'aggService';


    angular.module('app')
        .factory(serviceId, function ($q, dataconfig, datasearch) {

            //#region service
            var service = {
                data: datasearch,
                config:dataconfig,
                drawTreeMap: drawTreeMap,
                addPieContainer: addPieContainer,
                removePieContainer: removePieContainer,
                drawaggDashboard1: drawaggDashboard1,
                drawaggDashboard2: drawaggDashboard2
            }
            return service;
            //#endregion

            //#region agg service
            function drawTreeMap(fieldsName, size, start, end) {
                google.setOnLoadCallback(drawTreeMap);
                var datatree = new google.visualization.DataTable();

                var fieldstree = dataconfig.aggFieldFilter(fieldsName);
                datatree.addColumn('string', 'Name');
                datatree.addColumn('string', 'Parent');
                datatree.addColumn('number', 'count');
                datatree.addColumn('number', 'color');

                var tpromise = [];
                treeAddData(datatree, fieldstree, tpromise, size, start, end);
                var tree = new google.visualization.TreeMap(document.getElementById('treemap_div'));

                return $q.all(tpromise).then(function () {
                    startDrawTree(tree, datatree);
                }, function (e) {
                    log("TreeMap Promise Error" + e);
                });

                function treeAddData(datatree, fieldstree, tpromise, size, start, end) {
                    datatree.addRow(["Elasticsearch", null, 0, 0]);
                    fieldstree.map(function (m) {
                        datatree.addRow([m, "Elasticsearch", 0, 0]);
                        tpromise.push(treeMap(m, datatree, size, start, end));
                    });
                }

                function startDrawTree(tree, datatree) {
                    tree.draw(datatree, {
                        minColor: '#FFFFFF',
                        midColor: '#2EFEF7',
                        maxColor: '#00BFFF',
                        headerHeight: 15,
                        fontColor: 'black',
                        showScale: true,
                        showTooltips: true,
                        generateTooltip: showStaticTooltip
                    });

                    function showStaticTooltip(row, size, value) {
                        return '<div style="background:#fd9; padding:10px; border-style:solid">' +
                            '<a> Tag:' + datatree.getValue(row, 0) + '<hr>' + '</b> Size:' + size + '</b> Value:' + value + '</a>.</div>';
                    }

                    google.visualization.events.addListener(tree, 'select',
                        function () {
                            tree.goUpAndDraw();
                        });
                }

                function treeMap(aggName, datatree, size, start, end) {
                    return datasearch.termAggragation("", "", aggName, size, start, end)
                            .then(function (resp) {
                                var tt = resp.data.AggData;
                                tt.map(function (y) {
                                    var x = Math.random() * y.DocCount - 50;
                                    datatree.addRow([y.Key + "\n" + aggName, aggName, y.DocCount, x]);
                                });
                            }, function (err) {
                                //log("Tree data Load " + err.message);
                            });
                }
            }

            function removePieContainer() {
                try {
                    angular.element(document.getElementById('contain'))
                        .remove();
                } catch (e) {
                    toastr.info(e.message);
                }

            }

            function addPieContainer(fields) {
                angular.element(document.getElementById('div2')).
                      append("<div id=contain></div>");
                angular.forEach(fields, function (name) {
                    createContainer(name);
                });
            }

            //create container for chart
            function createContainer(aggName) {
                angular.element(document.getElementById('contain')).
                      append("<div id=contain" + aggName + "></div>");

                angular.element(document.getElementById('contain' + aggName)).
                      append("<div id=dash" + aggName + "></div>");

                angular.element(document.getElementById('dash' + aggName)).
                      append(
                      "<table id=table1" + aggName + "> <tbody> <tr>" +
                      "<td> <div id=range" + aggName + "></div> " +
                       "<div id=bar" + aggName + "></div></td>" +
                      "<td> <div id=table" + aggName + "></div></td>" +
                        "</tr> </tbody> </table>"
                        );
            }

            function drawaggDashboard1(agg, aggName, dashboardTag, sliderTag, pieTag) {
                google.setOnLoadCallback(drawaggDashboard1);
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'key');
                data.addColumn('number', 'Number');

                angular.forEach(agg, function (ag) {
                    data.addRow([ag.Key.toString(), ag.DocCount]);
                });

                // Create a dashboard.
                var dashboard = new google.visualization.Dashboard(
                    document.getElementById(dashboardTag));

                // Create a range slider, passing some options
                var donutRangeSlider = new google.visualization.ControlWrapper({
                    'controlType': 'NumberRangeFilter',
                    'containerId': sliderTag,
                    'options': {
                        'filterColumnLabel': 'Number'
                    }
                });

                // Create a pie chart, passing some options
                var pieChart = new google.visualization.ChartWrapper({
                    'chartType': 'PieChart',
                    'containerId': pieTag,
                    'options': {
                        'width': 800,
                        'height': 800,
                        'pieSliceText': 'value',
                        'legend': 'right',
                        'title': aggName,
                        is3D: true
                    }
                });

                dashboard.bind(donutRangeSlider, [pieChart]);
                dashboard.draw(data);
                google.visualization.events.addListener(pieChart, 'select', function () {
                    var row = pieChart.getSelection()[0].row;
                    var x = data.getValue(row, 0);
                    toastr.info(x);
                });
                return data;
            }

            function drawaggDashboard2(agg, y) {
                google.setOnLoadCallback(drawaggDashboard2);
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'key');
                data.addColumn('number', 'Count Range');

                angular.forEach(agg, function (ag) {
                    data.addRow([ag.Key.toString(), ag.DocCount]);
                });

                // Create a dashboard.
                var dashboard = new google.visualization.Dashboard(
                    document.getElementById("dash" + y));

                // Create a range slider, passing some options
                var donutRangeSlider = new google.visualization.ControlWrapper({
                    'controlType': 'NumberRangeFilter',
                    'containerId': "range" + y,
                    'options': {
                        'filterColumnLabel': 'Count Range'
                    }
                });

                // Create a pie chart, passing some options
                var pieChart = new google.visualization.ChartWrapper({
                    'chartType': 'PieChart',
                    'containerId': "bar" + y,
                    'options': {
                        'width': 800,
                        'height': 800,
                        'pieSliceText': 'value',
                        'legend': 'right',
                        'title': y
                    }
                });

                //table
                /*var table = new google.visualization.ChartWrapper({
                    'chartType': 'Table',
                    'containerId': "table"+y,
                    'options': {
                        'width': '300px'
                    }
                });*/

                // var name = "table" + y;
                //drawTable(data, name, y);

                dashboard.bind(donutRangeSlider, [pieChart]);
                dashboard.draw(data);
                return data;
            }
            //#endregion


        });
})();