# Development Notes

Since there is no longer an official open source release of CKEditor 4, any changes will have to be made manually and with restraint.

## Run the Development Server

To run the development server, clone this repository, run `npm run server`, and open [http://localhost:5050](http://localhost:5050) in your browser.

## Legacy Notes

> [!WARNING]
> Kept for historical purposes. CKEditor 4 is no longer maintained and should not be used for new projects.

### Updating CKEditor

To update the CKEditor code, [go to the builder](https://ckeditor.com/cke4/builder) and upload the `ckeditor/build-config.js` file to reuse the same settings and plugins. Download ZIP file, delete the current `ckeditor` folder, unpack the ZIP file into this repository, and finally commit and push. Also don't forget to update the version using the `npm version` command.

### Configure Client

In order for the configuration file to be used, it has to be configured in the client. For example in your page view module. Attention: for Bootstrap formatting in the editor, provide a Bootstrap CSS path in the contentsCss array. This also a good place to override options that may be needed for your project

```javascript
CKEDITOR.replace('editor', {
  customConfig: 'customConfig.js',
  contentsCss: [CKEDITOR.getUrl('contents.css'), 'path-to-bootstrap-css'],
  // We need more height, lets override! height: 1337
})
```

Finally, reference the CKEditor JavaScript file `ckeditor/ckeditor.js` and optionally `ckeditor/adapters/jquery.js` if you are using jQuery.

To test the editor without installing, clone this repository and run `npm run server` and open [http://localhost:5050](http://localhost:5050) in your browser.

### Note about the link dialog

Currently this works perfectly fine as it is. However, the link dialog is missing a way to edit the link text. Right now, the best way to ensure a specific link text is to first type out the text, then highlight it, then open the link dialog, enter a URL, and click OK It is being worked on by the CKEditor team, but it's not certain when it's finished.

### Sample config

For a sample config, check out the [server/public/js/index.js](server/public/js/index.js) file.
