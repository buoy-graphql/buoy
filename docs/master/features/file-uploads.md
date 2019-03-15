# File uploads

With Buoy, you can upload files to your backend through a mutation.
Just define the variables to contain the files your want to upload.
Supported types are [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File)
[`FileList`](https://developer.mozilla.org/en-US/docs/Web/API/FileList) and
[`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob).

## Preparing your backend

Your backend must support the [graphql-multipart-request-spec](https://github.com/jaydenseric/graphql-multipart-request-spec).
Lighthouse supports this out-of-the-box from version 3 and up. Follow their
[guide to enable file uploads](https://lighthouse-php.com/master/guides/file-uploads.html) in your schema.

## Uploading a file

In order to upload files, simply add them as variables.

**Example:**
```ts
public uploadFile(): void {
    this.buoy.mutate(
        gql `
            mutation ($file: Upload!) {
                shareFile(file: $file) {
                    url
                }
            }
        `,
        {
            // Pick the first file form file-input
            file: this.file.nativeElement.files[0]
        },
        {
            scope: 'shareFile'
        }
    ).toPromise().then(
        (success) => {
            console.log('File was uploaded, and is available at:', success.url);
        },
        (error) => {
            console.log('ERROR', error);
        }
    );
}
```
