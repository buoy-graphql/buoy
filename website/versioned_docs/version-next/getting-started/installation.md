---
id: version-next-installation
title: Installation
sidebar_label: Installation
original_id: installation
---

## Install via NPM

```bash
$ ng add ngx-buoy
```


## Include in your Project
After ngx-buoy is installed, you must include it in your application.

Add the `BuoyModule` to your `imports`-section and add the `BuoyConfig` provider in your `providers`-section.

````typescript
const BuoyConfigValue = <BuoyConfig>{
    // Remember to add the GraphUri to your environment-file.
    endpoint: environment.graphUri
};

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BuoyModule
    ],
    providers: [
        { provide: BuoyConfig, useValue: BuoyConfigValue }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor() { }
}
````

## 
