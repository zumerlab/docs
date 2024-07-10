---
title: Initial setup
---

## Orbit initial css variable declaration

When start a new Orbit project following css variables are declared:

```css
:root {
  --o-from: 0deg;
  --o-range: 360deg;
  --o-ellipse-x: 1;
  --o-ellipse-y: 1;
}
```

**Important:** Orbit can have multiples instances in same project. If your want different initial setup for some instances css variables can be redeclare at first `.orbital-zone`

```css
.instance-1 {
  --o-from: 90deg;
  --o-range: 360deg;
  --o-ellipse-x: 1;
  --o-ellipse-y: 1;
}

.instance-2 {
  --o-from: 0deg;
  --o-range: 1800deg;
  --o-ellipse-x: 0.8;
  --o-ellipse-y: 1;
}
```

```html
<div class="orbital-zone instance-1">
</div>

<div class="orbital-zone instance-2">
</div>
```



**Source:** [_settings.scss](https://github.com/zumerlab/orbit/blob/main/src/scss/_settings.scss)