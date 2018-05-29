# KTH CKEditor build

> __*Do not manually edit files in the `ckeditor` folder!*__

This project contains a custom build of the [CKEditor][CKEditor].

To update the CKEditor code, [go to the builder][CKEditorBuilder] and
upload the `ckeditor/build-config.js` file to reuse the same settings
and plugins. Download ZIP file, delete the current `ckeditor` folder,
unpack the ZIP file into this repository, and finally commit and push.
Also don't forget to update the version using the `npm version` command.

When installing this project through npm, run the following command:

```bash
npm install --save-dev @kth/kth-ckeditor-build
```

In the module there are Gulp tasks which are automatically executed during post installation.
They move the plugin as well as a configuration file into your project directory.

In order for the configuration file to be used, it has to be configured in the client.
For example in your page view module. Attention: for Bootstrap formatting in the editor, 
provide a Bootstrap CSS path in the contentsCss array.
This also a good place to override options that may be needed for your project

```javascript
	CKEDITOR.replace('editor', {
	  customConfig: 'customConfig.js',
	  contentsCss: [ CKEDITOR.getUrl('contents.css'), 'path-to-bootstrap-css']
	  // We need more height, lets override! height: 1337
	})
```

Finally, reference the CKEditor JavaScript file `ckeditor/ckeditor.js`
and optionally `ckeditor/adapters/jquery.js` if you are using jQuery.

To test the editor without installing, clone this repository and run
`npm run server` and open [http://localhost:5050][local] in your browser.

## Note about the link dialog

Currently this works perfectly fine as it is. However, the link dialog
is missing a way to edit the link text. Right now, the best way to
ensure a specific link text is to first type out the text, then
highlight it, then open the link dialog, enter a URL, and click OK. It
is being worked on by the CKEditor team, but it's not certain when it's
finished. 

## Sample config

For a sample config, check out the [server/public/js/index.js][sample]
file.

[CKEditor]: http://ckeditor.com
[CKEditorBuilder]: http://ckeditor.com/builder
[local]: http://localhost:5050
[sample]: server/public/js/index.js
