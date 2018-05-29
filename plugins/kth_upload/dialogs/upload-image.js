/* eslint-env browser */
/* globals CKEDITOR */

(function () {
  'use strict'

  CKEDITOR.dialog.add('kth_upload_image', function (editor) {
    const elements = [
      {
        type: 'file',
        id: 'file',
        label: editor.lang.kth_upload.chooseImage,
        setup: CKEDITOR.plugins.kth_upload.setup(editor.config.kth_uploadImageAccept),
        validate: CKEDITOR.plugins.kth_upload.validate(editor, editor.config.kth_uploadImageMaxSize)
      }
    ]

    if (editor.config.kth_uploadVisibility) {
      elements.push({
        type: 'select',
        id: 'visibility',
        label: editor.lang.kth_upload.visibility,
        items: [
          [ editor.lang.kth_upload.visibilityPublic, 'public' ],
          [ editor.lang.kth_upload.visibilityPrivate, 'auth' ],
          [ editor.lang.kth_upload.visibilityNone, 'private' ]
        ],
        'default': 'public'
      })

      elements.push({
        type: 'html',
        id: 'help',
        html: editor.lang.kth_upload.help,
        style: 'max-width: 250px; white-space: normal;'
      })
    }

    return {
      title: editor.lang.kth_upload.uploadImage,
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
          url: editor.config.kth_uploadImageUrl
        }, function (err, url) {
          CKEDITOR.plugins.kth_upload.onImageUploaded(editor, err, url)
        })
      }
    }
  })
})()
