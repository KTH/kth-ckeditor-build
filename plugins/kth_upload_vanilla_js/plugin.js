/* eslint-disable no-alert */
/* eslint-env browser */
/* globals CKEDITOR */
;(function () {
  'use strict'

  CKEDITOR.plugins.add('kth_upload_vanilla_js', {
    lang: 'en,sv',
    icons: 'image-upload,attachment-upload,browse',
    hidpi: true,
    init: function init(editor) {
      CKEDITOR.dialog.add('kth_upload_image', this.path + 'dialogs/upload-image.js')
      CKEDITOR.dialog.add('kth_upload_file', this.path + 'dialogs/upload-file.js')
      CKEDITOR.dialog.add('kth_upload_browse')
      CKEDITOR.plugins.kth_upload_vanilla_js.msg = editor.lang.kth_upload_vanilla_js
      // eslint-disable-next-line new-cap
      editor.addCommand('kth_upload_file', new CKEDITOR.dialogCommand('kth_upload_file'))
      // eslint-disable-next-line new-cap
      editor.addCommand('kth_upload_image', new CKEDITOR.dialogCommand('kth_upload_image'))

      editor.addCommand('kth_upload_browse', {
        exec: function execBrowse() {
          alert('Not implemented.') // Profiles-web: Currently overwritten on CKEditor instance ready with react implementation.
        },
      })

      editor.ui.addButton('kth_upload_file', {
        label: editor.lang.kth_upload_vanilla_js.uploadFile,
        command: 'kth_upload_file',
        toolbar: 'insert',
        icon: 'attachment-upload',
      })

      editor.ui.addButton('kth_upload_image', {
        label: editor.lang.kth_upload_vanilla_js.uploadImage,
        command: 'kth_upload_image',
        toolbar: 'insert',
        icon: 'image-upload',
      })

      editor.ui.addButton('kth_upload_browse', {
        label: editor.lang.kth_upload_vanilla_js.browseFiles,
        command: 'kth_upload_browse',
        toolbar: 'insert',
        icon: 'browse',
      })
    },
  })

  CKEDITOR.plugins.kth_upload_vanilla_js = {
    upload(options, callback) {
      const formData = new FormData()
      formData.append('upload', options.file)
      formData.append('visibility', options.visibility)

      const xhr = new XMLHttpRequest()

      xhr.open('POST', options.url)
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
      xhr.setRequestHeader('Accept', 'application/json')

      xhr.onload = function () {
        if (xhr.status === 200) {
          try {
            const { url } = JSON.parse(xhr.responseText)
            callback(null, url)
          } catch (err) {
            callback(err)
          }
        } else if (xhr.status === 400) {
          let message
          try {
            message = JSON.parse(xhr.responseText).message
          } catch (_) {
            // failed parsing, continue with default
            message = CKEDITOR.plugins.kth_upload_vanilla_js.msg.errorInvalidFile
          }
          callback(new Error(message))
        } else {
          callback(new Error(CKEDITOR.plugins.kth_upload_vanilla_js.msg.errorGeneric))
        }
      }

      xhr.send(formData)
    },

    humanSize(size) {
      const suffix = ['', 'k', 'M', 'G', 'T']
      let i = 0
      let newSize = size

      while (newSize > 1000) {
        newSize /= 1000
        i += 1
      }

      newSize = Math.round(newSize * 100) / 100

      return newSize + ' ' + suffix[i] + 'B'
    },

    validate(editor, maxSize) {
      return function () {
        try {
          const file = this.getInputElement().$.files[0]
          if (!file) {
            // no file in the field
            return CKEDITOR.dialog.validate.notEmpty(editor.lang.kth_upload_vanilla_js.errorRequired).call(this)
          }

          // make sure file size isn't too big
          CKEDITOR.dialog.validate
            .functions(function () {
              return file.size <= maxSize
            }, editor.lang.kth_upload_vanilla_js.errorSize.replace(
              '{maxSize}',
              CKEDITOR.plugins.kth_upload_vanilla_js.humanSize(maxSize)
            ))
            .call(this)
        } catch (ex) {
          return false
        }
        return true
      }
    },

    onImageUploaded(editor, err, url) {
      if (err) {
        return alert(err.message)
      }

      const img = new Image()
      img.onload = function () {
        const pluginConfig = editor.config.kth_upload
        // Add custom classes from config
        editor.insertHtml(
          '<img src="' + url + '" alt="" class="' + ((pluginConfig && pluginConfig.imageClasses) || '') + '">'
        )
      }
      img.src = url
      return true
    },

    onFileUploaded: function fileUploadCallback(editor, err, url) {
      if (err) {
        return alert(err.message)
      }

      const text = editor.getSelectedHtml(true) || url.substr(url.lastIndexOf('/') + 1) || url
      editor.insertHtml('<a href="' + url + '">' + text + '</a>')
      return true
    },

    setup(accept) {
      return function () {
        this.getInputElement().setAttribute('accept', accept)
      }
    },
  }
  /**
   * The upload endpoint for file attachments.
   *
   * @cfg {String} kth_uploadFileUrl
   * @memberOf CKEDITOR.config
   */
  CKEDITOR.config.kth_uploadFileAccept =
    '.pdf, .dot, .dotx, .doc, .docx, .ppt, .pptx, .xls, .xlsx, .jpg, .jpeg, .gif, .png'

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
