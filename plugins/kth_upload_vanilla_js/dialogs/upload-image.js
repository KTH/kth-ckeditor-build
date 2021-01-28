/* eslint-env browser */
/* globals CKEDITOR */

;(function () {
  'use strict'

  CKEDITOR.dialog.add('kth_upload_image', function (editor) {
    const elements = [
      {
        type: 'file',
        id: 'file',
        label: editor.lang.kth_upload_vanilla_js.chooseImage,
        setup: CKEDITOR.plugins.kth_upload_vanilla_js.setup(editor.config.kth_uploadImageAccept),
        validate: CKEDITOR.plugins.kth_upload_vanilla_js.validate(editor, editor.config.kth_uploadImageMaxSize),
      },
    ]

    if (editor.config.kth_uploadVisibility) {
      elements.push({
        type: 'select',
        id: 'visibility',
        label: editor.lang.kth_upload_vanilla_js.visibility,
        items: [
          [editor.lang.kth_upload_vanilla_js.visibilityPublic, 'public'],
          [editor.lang.kth_upload_vanilla_js.visibilityPrivate, 'auth'],
          [editor.lang.kth_upload_vanilla_js.visibilityNone, 'private'],
        ],
        default: 'public',
      })

      elements.push({
        type: 'html',
        id: 'help',
        html: editor.lang.kth_upload_vanilla_js.help,
        style: 'max-width: 250px; white-space: normal;',
      })
    }

    return {
      title: editor.lang.kth_upload_vanilla_js.uploadImage,
      minHeight: 150,
      minWidth: 300,
      resizable: CKEDITOR.DIALOG_RESIZE_NONE,
      contents: [
        {
          id: 'info',
          elements,
        },
      ],

      onShow() {
        this.setupContent()
      },

      onOk() {
        CKEDITOR.plugins.kth_upload_vanilla_js.upload(
          {
            file: this.getContentElement('info', 'file').getInputElement().$.files[0],
            visibility: this.getValueOf('info', 'visibility'),
            url: editor.config.kth_uploadImageUrl,
          },
          function (err, url) {
            CKEDITOR.plugins.kth_upload_vanilla_js.onImageUploaded(editor, err, url)
          }
        )
      },
    }
  })
})()
