/* globals CKEDITOR */

/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function (config) {
  // Define changes to default configuration here.
  // For complete reference see:
  // http://docs.ckeditor.com/#!/api/CKEDITOR.config

  config.contentsCss = [
    CKEDITOR.getUrl('contents.css'),
    '/vendor/bootstrap/css/bootstrap.min.css',
    '/vendor/kth-style/css/kth-bootstrap-theme.min.css',
    CKEDITOR.getUrl('contentOverride.css')
  ]
  config.kth_uploadImageUrl = '/upload'
  config.kth_uploadFileUrl = '/upload'
  config.kth_uploadBrowseUrl = '/browse'
  config.height = 600
  config.format_tags = 'p;h3;pre'
  config.removeDialogTabs = 'link:advanced;link:upload;link:target;image:advanced;'
  config.mathJaxLib = '//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML'
  config.language = 'sv'
  config.extraPlugins = 'kth_upload'
  // set alignment classes for images
  config.image2_disableResizer = true
  config.image2_alignClasses = [ 'pull-left', 'text-center', 'pull-right' ]
  // set extra content to allow images and image related styling
  // this is needed since we do not include the image plugin in the toolbar
  // for more details, read about the advanced content filter's automatic setting
  //
  // also allow basic table styling
  //
  // http://docs.ckeditor.com/#!/guide/dev_advanced_content_filter-section-2
  config.extraAllowedContent = {
    img: {
      attributes: '!src,alt,width,height',
      classes: 'pull-left,pull-right,img-responsive'
    },
    div: {
      classes: 'text-center,table-responsive'
    },
    p: {
      classes: 'text-center'
    },
    table: {
      classes: 'table'
    }
  }
  config.toolbar = [
    {
      name: 'format',
      items: [ 'RemoveFormat', 'Format' ]
    },
    {
      name: 'document',
      items: [ 'Source' ]
    },
    {
      name: 'editing',
      items: [ 'Find' ]
    },
    {
      name: 'insert',
      items: [ 'Table' ]
    },
    {
      name: 'kth',
      items: [ 'kth_upload_file', 'kth_upload_image', 'kth_upload_browse' ]
    },
    '/',
    {
      name: 'clipboard',
      items: [ 'Undo', 'Redo' ]
    },
    {
      name: 'basicstyles',
      items: [ 'Bold', 'Italic', 'Strike', 'BulletedList', 'NumberedList', 'Outdent', 'Indent' ]
    },
    {
      name: 'links',
      items: [ 'Link', 'Unlink', 'Anchor', 'Mathjax', 'Embed', 'SpecialChar' ]
    }
  ]

  CKEDITOR.on('instanceLoaded', function (ev) {
    var lang = ev.editor.langCode
    // set custom translation for h3 tags in format plugin
    CKEDITOR.lang[ lang ].format.tag_h3 = lang === 'sv' ? 'Rubrik' : 'Heading'
  })

  function setupTableDialog (data) {
    var names = [ 'table', 'tableProperties', 'bt_table', 'bt_tableProperties' ]
    if (names.indexOf(data.name) === -1) {
      return
    }

    var contents = data.definition.getContents('info')

    contents.remove('txtCellSpace')
    contents.remove('txtCellPad')
    contents.remove('txtCaption')
    contents.remove('txtSummary')
    contents.remove('txtWidth')
    contents.remove('txtHeight')
    contents.remove('txtBorder')
    contents.remove('tableStriped')
    contents.remove('tableHover')
    contents.remove('tableCondensed')
    contents.remove('tableBordered')
  }

  function setupImageDialog (data) {
    var names = [ 'image', 'image2' ]
    if (names.indexOf(data.name) === -1) {
      return
    }

    var contents = data.definition.getContents('info')

    contents.remove('src')
    contents.remove('hasCaption')
  }

  function setupLinkDialog (data) {
    var names = [ 'link' ]
    if (names.indexOf(data.name) === -1) {
      return
    }

    var contents = data.definition.getContents('info')

    contents.remove('browse')
    contents.get('protocol')[ 'default' ] = 'https://'
  }

  // Remove unnecessary table dialog fields
  CKEDITOR.on('dialogDefinition', function (ev) {
    [ setupTableDialog, setupImageDialog, setupLinkDialog ]
      .forEach(function (fn) {
        fn(ev.data)
      })
  })
}
