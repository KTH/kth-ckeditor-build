/* eslint-env browser */
/* globals CKEDITOR */

(function () {
  'use strict'

  CKEDITOR.dialog.add('kth_upload_file', function (editor) {
    const elements = [
      {
        type: 'file',
        id: 'file',
        label: editor.lang.kth_upload.chooseFile,
        setup: CKEDITOR.plugins.kth_upload.setup(editor.config.kth_uploadFileAccept),
        validate: CKEDITOR.plugins.kth_upload.validate(editor, editor.config.kth_uploadFileMaxSize)
      }
    ]

    if (editor.config.kth_uploadVisibility) {
      elements.push({
        type: 'select',
        id: 'visibility',
        label: editor.lang.kth_upload.visibility,
        'default': 'public',
        items: [
          [ editor.lang.kth_upload.visibilityPublic, 'public' ],
          [ editor.lang.kth_upload.visibilityPrivate, 'auth' ],
          [ editor.lang.kth_upload.visibilityNone, 'private' ]
        ]
      })

      elements.push({
        type: 'html',
        id: 'help',
        html: editor.lang.kth_upload.help,
        style: 'max-width: 250px; white-space: normal;'
      })
    }

    return {
      title: editor.lang.kth_upload.uploadFile,
      minHeight: 150,
      minWidth: 300,
      resizable: CKEDITOR.DIALOG_RESIZE_NONE,
      contents: [
        {
          id: 'info',
          elements: elements
        }
      ],

      onShow: function () {
        this.setupContent()
      },

      onOk: function () {
        CKEDITOR.plugins.kth_upload.upload({
          file: this.getContentElement('info', 'file').getInputElement().$.files[ 0 ],
          visibility: this.getValueOf('info', 'visibility'),
          url: editor.config.kth_uploadFileUrl
        }, function (err, url) {
          CKEDITOR.plugins.kth_upload.onFileUploaded(editor, err, url)
        })
      }
    }
  })
})()
