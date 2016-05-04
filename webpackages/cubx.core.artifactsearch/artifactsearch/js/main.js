/*globals  app, kshf, d3, jQuery*/

/**
 * Main entry point.
 *
 * the DOM has been localized and the user sees it in their language.
 *
 * @class Main
 */
(function ($, kshf, d3) {
  'use strict';

  /* InfoBox definition überschreiben!!! */
  kshf.Browser.prototype.insertInfobox = function () {
    var me = this;
    var creditString = '';
    creditString += '<div class="info_box">';
    creditString += '<div class="info_box_title">';
    creditString += 'Base/Artifactsearch';
    creditString += '</div>';

    creditString += '<div class="info">Data Browser for Artifacts</div>';

    creditString += '<div class="project">';
    creditString += '<div class="title">Projekt:</div>';
    creditString += '<div class="value">Webble TAG - Technology Application Group</div>';
    creditString += '<div style="clear:both"></div>';
    creditString += '</div>';

    creditString += '<div class="project_executing_organisation">';
    creditString += '<div class="title">Project executing organisation:</div>';
    creditString += '<div class="value">promoted by Bundesministerium für Bildung und Forschung</div>';
    creditString += '<div style="clear:both"></div>';
    creditString += '</div>';

    creditString +=
      '<div class="footer">This data browser is created by <span class="libName">Keshif</span>.</div>';

    creditString += '</div>';

    this.layout_infobox = this.root.append('div').attr('class', 'kshf layout_infobox');
    this.layout_infobox.append('div')
      .attr('class', 'infobox_background')
      .on('click', function () {
        me.layout_infobox.style('display', 'none');
        me.layout_infobox.select('div.infobox_credit').style('display', 'none');
        me.layout_infobox.select('div.infobox_datasource').style('display', 'none');
      });
    this.dom.loadingBox = this.layout_infobox.append('div').attr('class', 'infobox_content infobox_loading');
    // this.dom.loadingBox.append('span').attr('class','fa fa-spinner fa-spin');
    var ssdsd = this.dom.loadingBox.append('span').attr('class', 'loadinggg');
    ssdsd.append('span').attr('class', 'loading_dots loading_dots_1').attr('anim', true);
    ssdsd.append('span').attr('class', 'loading_dots loading_dots_2').attr('anim', true);
    ssdsd.append('span').attr('class', 'loading_dots loading_dots_3').attr('anim', true);

    var hmmm = this.dom.loadingBox.append('div').attr('class', 'status_text');
    hmmm.append('span').attr('class', 'info').text('Loading data sources...');
    hmmm.append('span').attr('class', 'dynamic')
      .text((this.source.sheets !== undefined) ? '(' + this.source.loadedTableCount + '/' + this.source.sheets.length + ')' : '');

    var infoboxcredit = this.layout_infobox.append('div').attr('class', 'infobox_content infobox_credit');
    infoboxcredit.append('div').attr('class', 'infobox_close_button').text('x')
      .on('click', function () {
        me.layout_infobox.style('display', 'none');
        me.layout_infobox.select('div.infobox_credit').style('display', 'none');
        me.layout_infobox.select('div.infobox_datasource').style('display', 'none');
      });
    infoboxcredit.append('div').attr('class', 'all-the-credits').html(creditString);
  };

  // Applikationsstart
  app($, kshf, d3);// jshint ignore:line
}(jQuery, kshf, d3));
