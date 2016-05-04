/* eslint no-unused-vars: [2,{"varsIgnorePattern": "app|browser"}] */
function app ($, kshf, d3) {
  'use strict';
  var browser;
  $(document).ready(
    function () {
      browser = new kshf.Browser(
        {
          domID: '#chart_div',
          categoryTextWidth: 150,
          barChartWidth: 110,
          itemName: 'artifacts',
          source: {
            callback: function (browser) {
              browser.primaryTableName = 'artifacts';
              kshf.dt.artifacts = [];
              $.ajax({
                url: '../../_design/couchapp-artifactsearch/_list/listArtifacts/viewArtifacts',
                async: true,
                success: function (data) {
                  data.forEach(function (item) {
                    var content = item;
                    var dataTable = {};
                    dataTable.artifactId = content.artifactId;
                    dataTable.artifactDescription = content.artifactDescription;
                    dataTable.webpackageDescription = content.webpackageDescription;
                    dataTable.webpackageId = content.webpackageId;
                    dataTable.name = content.name;
                    dataTable.groupId = content.groupId;
                    dataTable.version = content.version;
                    dataTable.artifactType = content.artifactType;
                    dataTable.modelVersion = content.modelVersion;
                    dataTable.author = content.author;
                    dataTable.baseContext = content.baseContext;
                    dataTable.man = content.man;
                    dataTable.keywords = content.keywords;
                    dataTable.homepage = content.homepage;
                    dataTable.license = content.license;
                    dataTable.contributors = content.contributors;
                    dataTable.endpoints = content.endpoints;
                    dataTable.webpackageRunnables = content.webpackageRunnables;
                    dataTable.artifactRunnables = content.artifactRunnables;
                    dataTable.id = dataTable.webpackageId + '/' + dataTable.artifactId;

                    dataTable.uploadInProgress = content.baseContext.uploadInfos.uploadInProgress || false;
                    var kshfItem = new kshf.Item(dataTable, 'id');
                    kshf.dt.artifacts.push(kshfItem);
                  });

                  browser.items = kshf.dt.artifacts;

                  browser.itemsSelectedCt = browser.items.length;

                  // finish loading....
                  d3.select('.kshf.layout_infobox div.status_text span').text('Creating browser');
                  d3.select('.kshf.layout_infobox div.status_text div').text('');

                  window.setTimeout(function () {
                    browser.loadCharts();
                  }, 100);
                },
                error: function () {
                  d3.select('.kshf.layout_infobox div.status_text span')
                    .text('Error by catching data...');
                }
              });
            }

          },
          facets: [
            {
              facetTitle: 'ArtifactType',
              catTabName: 'artifacts',
              catItemMap: function (d) {
                return getArtifactTypeText(d.data.artifactType);
              }
            },

            {
              facetTitle: 'Snapshots/Releases',
              catTabName: 'artifacts',
              catItemMap: function (d) {
                return d.data.webpackageId.endsWith('-SNAPSHOT') ? 'Snapshots' : 'Releases';
              }
            },
            {
              facetTitle: 'Authors',
              catTabName: 'artifacts',
              catItemMap: function (d) {
                var authorNames = [];
                if (d.data.author) {
                  if (d.data.author && typeof d.data.author === 'string') {
                    authorNames.push(d.data.author);
                  } else if (d.data.author.name) {
                    authorNames.push(d.data.author.name);
                  }
                } else {
                  authorNames.push('-');
                }
                return authorNames;
              }
            },
            {
              facetTitle: 'Contributors',
              catTabName: 'artifacts',
              catItemMap: function (d) {
                var contributorNames = [];
                if (d.data.contributors && d.data.contributors.length > 0) {
                  for (var contributor in d.data.contributors) {
                    contributorNames.push(d.data.contributors[ contributor ].name);
                  }
                  // contributorNames.push(list);
                } else {
                  contributorNames.push('-');
                }
                return contributorNames;
              }
            },
            {
              facetTitle: 'Model Version',
              layout: 'right',
              catTabName: 'artifacts',
              catItemMap: function (d) {
                return d.data.modelVersion ? d.data.modelVersion : void (0);
              }
            },
            {
              facetTitle: 'Keywords',
              layout: 'right',
              catTabName: 'artifacts',
              catItemMap: function (d) {
                return d.data.keywords ? d.data.keywords : [];
              }
            },
            {
              facetTitle: 'GroupId',
              layout: 'right',
              catTabName: 'artifacts',
              catItemMap: function (d) {
                var retValue;
                if (d.data.groupId) {
                  retValue = notEmptyData(d.data.groupId) ? d.data.groupId : '-';
                }
                return retValue;
              }
            },
            {
              facetTitle: 'License',
              layout: 'right',
              catTabName: 'artifacts',
              catItemMap: function (d) {
                return d.data.license ? d.data.license : 'nicht angegeben';
              }
            }
          ],
          itemDisplay: {
            sortColWidth: 140,
            sortingOpts: [
              {
                name: 'upload date',
                value: function (d) {
                  if (!d.data.baseContext || !d.data.baseContext.uploadInfos || !d.data.baseContext.uploadInfos.date) {
                    return '';
                  }
                  return Date.parse(d.data.baseContext.uploadInfos.date);
                },
                label: function (d) {
                  if (!d.data.baseContext || !d.data.baseContext.uploadInfos || !d.data.baseContext.uploadInfos.date) {
                    return '';
                  }
                  return new Date(d.data.baseContext.uploadInfos.date).toLocaleString();
                }
              },
              {
                name: 'groupId',
                value: function (d) {
                  if (d.data.groupId === undefined) {
                    return '';
                  }
                  return d.data.groupId;
                },
                label: function (d) {
                  if (d.data.groupId === undefined) {
                    return '';
                  }
                  return d.data.groupId;
                }
              },
              {
                name: 'name',
                value: function (d) {
                  if (d.data.name === undefined) {
                    return '-';
                  }
                  return d.data.name;
                },
                label: function (d) {
                  return d.data.name;
                }
              },
              {
                name: 'version',
                value: function (d) {
                  if (d.data.version === undefined) {
                    return '';
                  }
                  return d.data.version;
                },
                label: function (d) {
                  if (d.data.version === undefined) {
                    return '';
                  }
                  return d.data.version;
                }
              },
              {
                name: 'artifactId',
                value: function (d) {
                  if (d.data.artifactId === undefined) {
                    return '';
                  }
                  return d.data.artifactId;
                },
                label: function (d) {
                  if (d.data.artifactId === undefined) {
                    return '';
                  }
                  return d.data.artifactId;
                }
              }
            ],
            textSearch: 'groupId.name@version/artifactId',
            textSearchFunc: function (d) {
              return d.data.groupId + '.' + d.data.name + '@' + d.data.version + '/' + d.data.artifactId;
            },
            displayType: 'list',
            autoExpandMore: true,
            detailsToggle: 'Zoom',
            showSelectBox: true,
            maxVisibleItems_Default: 500,
            contentFunc: function (d) {
              var titleText = '';
              var title;
              var content;
              var item;
              var i;

              titleText = buildId(d.data.groupId, d.data.name, d.data.version, d.data.artifactId);

              title = '<div class="title">' + titleText + '</div>';
              if (d.data.uploadInProgress) {
                title += '<div>';
                title += '<i class = "fa fa-bolt error"></i>';
                title += '<span class="fa error-text">broken&nbsp;upload!</span>';
                title += '</div>';
              }
              title += '<div class="runnables">';
              title += '<span class="runnable-separator">&#160;</span>' +
                '<a class="fa fa-cubes externallink" target="' +
                d.data + '" href="../../' + d.data.webpackageId + '" >manifest</a>';

              if (d.data.webpackageRunnables) {
                for (var wRunnable in d.data.webpackageRunnables) {
                  title +=
                    '<span class="runnable-separator">&#124;</span>' +
                    '<a class="fa fa-external-link externallink" target="' +
                    d.data + '" href="../../' + d.data.webpackageId +
                    d.data.webpackageRunnables[ wRunnable ].path + '" title="' +
                    d.data.webpackageRunnables[ wRunnable ].description + '">' +
                    d.data.webpackageRunnables[ wRunnable ].name + '</a>';
                }
              }
              if (d.data.artifactRunnables) {
                for (var aRunnable in d.data.artifactRunnables) {
                  title +=
                    '<span class="runnable-separator">&#124;</span>' +
                    '<a class="fa fa-external-link externallink" target="' +
                    d.data + '" href="../../' + d.data.webpackageId + '/' + d.data.artifactId +
                    d.data.artifactRunnables[ aRunnable ].path + '" title="' +
                    d.data.artifactRunnables[ aRunnable ].description + '">' +
                    d.data.artifactRunnables[ aRunnable ].name + '</a>';
                }
              }
              title += '</div>';
              item = title;
              content = '<div class="item_details">';
              content += '<div class="detail type">';
              content += '<span class="header">Type: </span>';
              content += '<span class="value">' + getArtifactTypeText(d.data.artifactType) + '</span>';
              content += '</div>';

              if (notEmptyData(d.data.artifactDescription) ||
                notEmptyData(d.data.webpackageDescription)) {
                content += '<div class="detail description">';
                if (notEmptyData(d.data.webpackageDescription)) {
                  content += '<span class="header">Webpackage description: </span>';
                  content += '<span class="value">' + d.data.webpackageDescription + '</span>';
                }
                if (notEmptyData(d.data.artifactDescription) &&
                  notEmptyData(d.data.webpackageDescription)) {
                  content += '<br>';
                }
                if (notEmptyData(d.data.artifactDescription)) {
                  content += '<span class="header">Artifact description: </span>';
                  content += '<span class="value">' + d.data.artifactDescription + '</span>';
                }
                content += '</div>';
              }
              if (notEmptyData(d.data.homepage)) {
                content += '<div class="detail homepage">';
                content += '<span class="header">Homepage: </span>';
                content += '<span class="value">';
                content += '<a href="' + d.data.homepage + '">' + d.data.homepage + '</a>';
                content += '</span>';
                content += '</div>';
              }

              if (notEmptyData(d.data.man)) {
                content += '<div class="detail man">';
                content += '<span class="header">Dokumentation: </span>';
                content += '<span class="value">';
                if (typeof d.data.man === 'string') {
                  content += d.data.man;
                } else {
                  for (i = 0; i < d.data.man.length; i++) {
                    if (i > 0) {
                      content += ', ';
                    }
                    content += '<a   href = "' + d.data.man[ i ] + '" >' + d.data.man[ i ] + '</a>';
                  }
                }

                content += '</span>';
                content += '</div>';
              }
              if (d.data.author) {
                content += '<div class="detail authors">';
                content += '<span class="header">Author: </span>';
                content += '<span class="value">';

                content += d.data.author.name;
                content += ' <a href = "mailto:' + d.data.author.email + '"> (E - Mail) </a> ';
                if (d.data.author.url) {
                  content += ' < a  href = "' +
                    d.data.author.url + '" >(Url)</a>';
                }
                content += '</span>';
                content += '</div>';
              }

              if (notEmptyData(d.data.contributors)) {
                content += '<div class="detail contributors">';
                content += '<span class="header">Contributors: </span>';
                content += '<span class="value">';

                for (i = 0; i < d.data.contributors.length; i++) {
                  if (i > 0) {
                    content += ', ';
                  }

                  content += d.data.contributors[ i ].name;
                  content += ' <a href = "mailto:' +
                    d.data.contributors[ i ].email + '"> (E - Mail) </a> ';
                  if (d.data.contributors[ i ].url) {
                    content += ' <a href = "' + d.data.contributors[ i ].url + '" >(Url)</a>';
                  }
                }

                content += '</span>';
                content += '</div>';
              }
              if (d.data.baseContext && d.data.baseContext.uploadInfos &&
                notEmptyData(d.data.baseContext.uploadInfos.date)) {
                content += '<div class="detail date">';
                content += '<span class="header">Upload date: </span>';
                content += '<span class="value">';
                content += new Date(d.data.baseContext.uploadInfos.date).toLocaleString();
                content += '</span>';
                content += '</div>';
              }
              if (d.data.endpoints) {
                for (var endpoint in d.data.endpoints) {
                  content += '<div class="detail">';
                  content += '<hr>';
                  content += '</div>';
                  content += '<div class="detail endpoints">';
                  content += '<span class="header">Endpoint "' +
                    d.data.endpoints[ endpoint ].endpointId + '"</span>';

                  var endpointRef = buildId(d.data.groupId, d.data.name, d.data.version,
                      d.data.artifactId) + '/' + d.data.endpoints[ endpoint ].endpointId;
                  content += '<a href="#" class="fa fa-files-o endpoint-copy-symbol" ' +
                    'onclick="copyTextToClipboard(\'' + endpointRef +
                    '\');event.preventDefault()" ' +
                    'title="copy endpoint reference for usage as dependency"></a>';
                  // content += '</span>';
                  content += '</div>';
                  if (notEmptyData(d.data.endpoints[ endpoint ].description)) {
                    content += '<div class="detail description subdetail">';
                    content += '<span class="subheader">Description: </span>';
                    content += '<span class="value subdetailvalue">' + d.data.endpoints[ endpoint ].description +
                      '</span>';
                    content += '</div>';
                  }
                  if (d.data.endpoints[ endpoint ].resources) {
                    content += '<div class="detail resources subdetail">';
                    content += '<span class="subheader">Resources: </span>';
                    for (var res = 0; res < d.data.endpoints[ endpoint ].resources.length; res++) {
                      content += '<div class="value listelement subdetailvalue">';

                      content += formatResource(d.data.endpoints[ endpoint ].resources[ res ]);
                      content += '</div>';
                    }
                    content += '</div>';
                  }
                  if (d.data.endpoints[ endpoint ].dependencies) {
                    content += '<div class="detail dependencies subdetail">';
                    content += '<span class="subheader">Dependencies: </span>';
                    for (var dep = 0; dep < d.data.endpoints[ endpoint ].dependencies.length; dep++) {
                      content += '<div class="value listelement subdetailvalue">';
                      content += formatDependency(d.data.endpoints[ endpoint ].dependencies[ dep ]);
                      content += '</div>';
                    }

                    content += '</div>';
                  }
                }
              }

              content += '</div>';
              item += content;

              return item;
            }

          }
        }
      );
      function resizeBrowser () {
        $('#chart_div').width($(window).width() - 60);
        $('#chart_div').height($(window).height() - 20);
      }

      resizeBrowser();
      window.addEventListener('resize', function () {
        resizeBrowser();
        browser.updateLayout();
      });
    }
  );

  function formatDependency (dependency) {
    var retvalue;

    if (typeof dependency === 'string') {
      retvalue = dependency;
    } else if (dependency.id) {
      retvalue = dependency.id;
    } else {
      retvalue = dependency.groupId ? dependency.groupId : '';
      if (retvalue.length !== 0) {
        retvalue += '.';
      }
      retvalue += dependency.name ? dependency.name : '';
      if (retvalue.length !== 0) {
        retvalue += '-';
      }
      retvalue += dependency.version ? dependency.version : '';
    }
    return retvalue;
  }

  function formatResource (resource) {
    var retvalue;
    if (typeof resource === 'string') {
      retvalue = resource;
    } else {
      retvalue = resource.prod ? resource.prod + '(prod)' : '';
      if (retvalue.length !== 0) {
        retvalue += ' oder ';
      }
      retvalue += resource.dev ? resource.dev + '(dev)' : '';
    }
    return retvalue;
  }

  function getArtifactTypeText (type) {
    var str;
    switch (type) {
      case 'compoundComponent':
        str = 'Compound Component';
        break;
      case 'elementaryComponent':
        str = 'Elementary Component';
        break;
      case 'utility':
        str = 'Utility';
        break;
      case 'app':
        str = 'Application';
        break;
      default:
        str = 'unknown';
        break;
    }
    return str;
  }

  function notEmptyData (data) {
    return data && data.length > 0;
  }

  function show (element, visibleClass, hiddenClass) {
    $(element).addClass(visibleClass);
    $(element).removeClass(hiddenClass);
  }

  window.show = show;

  function copyTextToClipboard (text) {
    var textArea = document.createElement('textarea');

    //
    // *** This styling is an extra step which is likely not required. ***
    //
    // Why is it here? To ensure:
    // 1. the element is able to have focus and selection.
    // 2. if element was to flash render it has minimal visual impact.
    // 3. less flakyness with selection and copying which **might** occur if
    //    the textarea element is not visible.
    //
    // The likelihood is the element won't even render, not even a flash,
    // so some of these are just precautions. However in IE the element
    // is visible whilst the popup box asking the user for permission for
    // the web page to copy to the clipboard.
    //

    // Place in top-left corner of screen regardless of scroll position.
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;

    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = '2em';
    textArea.style.height = '2em';

    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = 0;

    // Clean up any borders.
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';

    // Avoid flash of white box if rendered for any reason.
    textArea.style.background = 'transparent';

    textArea.value = text;

    document.body.appendChild(textArea);

    textArea.select();

    try {
      document.execCommand('copy');
      // var successful = document.execCommand('copy');
      // var msg = successful ? 'successful' : 'unsuccessful';
      // console.log('Copying text command was ' + msg);
    } catch (err) {
      console.error('Unable to copy.');
    }

    document.body.removeChild(textArea);
  }

  window.copyTextToClipboard = copyTextToClipboard;
  function buildId (groupId, name, version, artifactId) {
    var id = '';
    if (groupId && groupId.length > 0) {
      id = groupId + '.';
    }
    id += name;
    id += '@' + version;
    id += '/' + artifactId;

    return id;
  }
}
