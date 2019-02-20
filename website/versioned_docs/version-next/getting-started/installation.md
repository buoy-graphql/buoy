---
id: version-next-installation
title: Installation
sidebar_label: Installation
original_id: installation
---

## Install via NPM

```bash
$ ng add ngx-lighthouse
```


## Include in your Project
After ngx-buoy is installed, you must include it in your application.

````typescript
export class AppModule {
    constructor(
        private buoy: Buoy
    ) {
        this.buoy.init();
    }
}
````

## 
