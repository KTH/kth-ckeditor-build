/* eslint-env browser */
/* globals CKEDITOR, $ */

(function () {
  'use strict'

  CKEDITOR.plugins.add('kth_upload', {
    lang: 'en,sv',
    icons: 'image-upload,attachment-upload,browse',
    hidpi: true,
    init: function init (editor) {
      CKEDITOR.dialog.add('kth_upload_image', this.path + 'dialogs/upload-image.js')
      CKEDITOR.dialog.add('kth_upload_file', this.path + 'dialogs/upload-file.js')
      CKEDITOR.plugins.kth_upload.msg = editor.lang.kth_upload
      // setup file browser modal
      var modal = $('<div>', {
        'class': 'modal fade'
      })

      modal.appendTo('body')
      modal.on('hidden.bs.modal', function () {
        modalContent.empty()
      })

      var modalDialog = $('<div>', {
        'class': 'modal-dialog modal-lg'
      }).appendTo(modal)

      var modalContent = $('<div>', {
        'class': 'modal-content'
      }).appendTo(modalDialog)

      $(document).on('kth_upload.insert.image', function (event, data) {
        if (data.editorId === editor.id) {
          CKEDITOR.plugins.kth_upload.onImageUploaded(editor, null, data.url)
          modal.modal('hide')
        }
      })

      $(document).on('kth_upload.insert.link', function (event, data) {
        if (data.editorId === editor.id) {
          CKEDITOR.plugins.kth_upload.onFileUploaded(editor, null, data.url)
          modal.modal('hide')
        }
      })

      editor.addCommand('kth_upload_file', new CKEDITOR.dialogCommand('kth_upload_file'))
      editor.addCommand('kth_upload_image', new CKEDITOR.dialogCommand('kth_upload_image'))

      editor.addCommand('kth_upload_browse', {
        exec: function execBrowse (editor) {
          modalContent.load(editor.config.kth_uploadBrowseUrl, function () {
            // Set the editor id so we know where to insert images etc
            modal.attr('data-current-editor-id', editor.id)
            modal.modal()
          })
        }
      })

      editor.ui.addButton('kth_upload_file', {
        label: editor.lang.kth_upload.uploadFile,
        command: 'kth_upload_file',
        toolbar: 'insert',
        icon: 'attachment-upload'
      })

      editor.ui.addButton('kth_upload_image', {
        label: editor.lang.kth_upload.uploadImage,
        command: 'kth_upload_image',
        toolbar: 'insert',
        icon: 'image-upload'
      })

      editor.ui.addButton('kth_upload_browse', {
        label: editor.lang.kth_upload.browseFiles,
        command: 'kth_upload_browse',
        toolbar: 'insert',
        icon: 'browse'
      })
    }
  })

  CKEDITOR.plugins.kth_upload = {
    upload: function (options, callback) {
      var formData = new FormData()
      formData.append('upload', options.file)
      formData.append('visibility', options.visibility)

      var xhr = new XMLHttpRequest()

      xhr.open('POST', options.url)
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
      xhr.setRequestHeader('Accept', 'application/json')

      xhr.onload = function () {
        if (xhr.status === 200) {
          try {
            var url = JSON.parse(xhr.responseText).url
            callback(null, url)
          } catch (err) {
            callback(err)
          }
        } else {
          if (xhr.status === 400) {
            let message
            try {
              message = JSON.parse(xhr.responseText).message
            } catch (_) { // failed parsing, continue with default
              message = CKEDITOR.plugins.kth_upload.msg.errorInvalidFile
            }
            callback(new Error(message))
          } else {
            callback(new Error(CKEDITOR.plugins.kth_upload.msg.errorGeneric))
          }
        }
      }

      xhr.send(formData)
    },

    humanSize: function (size) {
      var suffix = [ '', 'k', 'M', 'G', 'T' ]
      var i = 0

      while (size > 1000) {
        size = size / 1000
        i = i + 1
      }

      size = Math.round(size * 100) / 100

      return size + ' ' + suffix[ i ] + 'B'
    },

    validate: function (editor, maxSize) {
      return function () {
        try {
          var file = this.getInputElement().$.files[ 0 ]
          if (!file) {
            // no file in the field
            return CKEDITOR.dialog.validate.notEmpty(editor.lang.kth_upload.errorRequired).call(this)
          }

          // make sure file size isn't too big
          return CKEDITOR.dialog.validate.functions(function () {
            return file.size <= maxSize
          }, editor.lang.kth_upload.errorSize.replace('{maxSize}', CKEDITOR.plugins.kth_upload.humanSize(maxSize))).call(this)
        } catch (ex) {
          return false
        }
      }
    },

    onImageUploaded: function (editor, err, url) {
      if (err) {
        return alert(err.message)
      }

      var img = new Image()
      img.onload = function () {
        var pluginConfig = editor.config.kth_upload
        // Add custom classes from config
        editor.insertHtml('<img src="' + url + '" alt="" class="' + (pluginConfig && pluginConfig.imageClasses || '') + '">')
      }
      img.src = url
    },

    onFileUploaded: function fileUploadCallback (editor, err, url) {
      if (err) {
        return alert(err.message)
      }

      var text = editor.getSelectedHtml(true) || (url.substr(url.lastIndexOf('/') + 1) || url)
      editor.insertHtml('<a href="' + url + '">' + text + '</a>')
    },

    setup: function (accept) {
      return function () {
        this.getInputElement().setAttribute('accept', accept)
      }
    }
  }

  /**
   * The upload endpoint for file attachments.
   *
   * @cfg {String} kth_uploadFileUrl
   * @memberOf CKEDITOR.config
   */
  CKEDITOR.config.kth_uploadFileUrl = '/upload?type=attachment'

  /**
   * Valid file types for attachments.
   *
   * @cfg {String} kth_uploadFileAccept
   * @memberOf CKEDITOR.config
   */
  CKEDITOR.config.kth_uploadFileAccept = '.pdf, .dot, .dotx, .doc, .docx, .ppt, .pptx, .xls, .xlsx, .jpg, .jpeg, .gif, .png'

  /**
   * Maximum file size in bytes for attachments.
   *
   * @cfg {Number} kth_uploadFileMaxSize
   * @memberOf CKEDITOR.config
   */
  CKEDITOR.config.kth_uploadFileMaxSize = 10000000

  /**
   * The upload endpoint for pictures.
   *
   * @cfg {String} kth_uploadImageUrl
   * @memberOf CKEDITOR.config
   */
  CKEDITOR.config.kth_uploadImageUrl = '/upload?type=picture'

  /**
   * The file browser endpoint.
   *
   * @cfg {String} kth_uploadBrowseUrl
   * @memberOf CKEDITOR.config
   */
  CKEDITOR.config.kth_uploadBrowseUrl = '/browse'

  /**
   * Valid file types for pictures.
   *
   * @cfg {String} kth_uploadImageAccept
   * @memberOf CKEDITOR.config
   */
  CKEDITOR.config.kth_uploadImageAccept = '.jpg, .jpeg, .gif, .png'

  /**
   * Maximum file size in bytes for pictures.
   *
   * @cfg {Number} kth_uploadImageMaxSize
   * @memberOf CKEDITOR.config
   */
  CKEDITOR.config.kth_uploadImageMaxSize = 10000000

  /**
   * Set to false to hide the visibility field.
   *
   * @cfg {Boolean} kth_uploadVisibility
   * @memberOf CKEDITOR.config
   */
  CKEDITOR.config.kth_uploadVisibility = true
})()
