function calcularExpresionCSS(cssExpression) {
  const match = cssExpression.match(/calc\(\s*([\d.]+)deg\s*\/\s*\(\s*(\d+)\s*-\s*(\d+)\s*\)\s*\)/);
  if (match) {
      const value = parseFloat(match[1]);
      const divisor = parseInt(match[2]) - parseInt(match[3]);
      if (!isNaN(value) && !isNaN(divisor) && divisor !== 0) {
          return value / divisor;
      }
  }
}


/*! 
## o-sector

`<o-sector>` is a standard web-component for rendering a radial slices or pies. By default there are 24 sector per orbit. The number can be modify with `$max-orbiters` var at `_variables.scss`.

### Custmization

  - Attribute `sector-color`: To set a color for sector. Default `orange`
  - Attribute `shape`: To set a different endings looks. Currently, you can choose between `circle`, `arrow`, `slash`, `backslash` and `zigzag` shapes. Default `none`

  - Utility class `.gap-*` applied on `.orbit` or `.orbit-*` or in `<o-sector>`: to set gap space between o-sectors. Default '0'
  - Utility class `.range-*`: Default '360deg'
  - Utility class `.from-*`: Default '0deg'
  - Utility class `.grow-*x`: To increase `o-sector` height by multiplying orbit radius. Default '1x'
  - Utility class `.reduce-*`: To reduce `o-sector` height by reducing current orbit percentage. Default '100'
  - Utility class `.inner-orbit`: To place `o-sector` just below its orbit
  - Utility class `.outer-orbit`: To place `o-sector` just above its orbit
  - Utility class `.quarter-inner-orbit`: To place `o-sector` a 25% into its orbit.
  - Utility class `.quarter-outer-orbit`: To place `o-sector` a 25% outer its orbit.


  - CSS styles. User can customize `o-sector` by adding CSS properties to `o-sector path`
  
**Important:** 

  - `<o-sector>` can only be used into `.orbit` or `.orbit-*`.
  - `<o-sector>` doesn't support ellipse shape. See `.orbit` section for more information.

### Usage

```html
<div class="orbit range-180"> 
  <o-sector />
  <o-sector class="gap-5" />
  <o-sector class="gap-10" />
  <o-sector class="gap-5" />
</div>
```
*/

export class OrbitSector extends HTMLElement {
  connectedCallback() {
    this.update()

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          this.update()
        }
      })
    })

    observer.observe(this, { attributes: true })
  }
  generateRandomString() {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    let randomString = '';
  
    // Generate 3 random letters
    for (let i = 0; i < 3; i++) {
      randomString += letters.charAt(Math.floor(Math.random() * letters.length));
    }
  
    // Generate 3 random numbers
    for (let i = 0; i < 3; i++) {
      randomString += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
  
    // Shuffle the string to randomize the order of letters and numbers
    randomString = randomString.split('').sort(() => Math.random() - 0.5).join('');
  
    return randomString;
  }
  update() {
    const {shape} = this.getAttributes()
    const randomId = this.generateRandomString()
    const svg = this.createSVGElement()
    if (shape !== 'none') {
      const defs = this.createDefs()
      const markerDefs = this.createMarker('head'+randomId, 'end');
      defs.appendChild(markerDefs);
      const markerDefs1 = this.createMarker('tail'+randomId, 'start');
      defs.appendChild(markerDefs1);
      svg.appendChild(defs)
    }
    const sectorArc = this.createSectorArc(randomId)
    svg.appendChild(sectorArc)
    this.innerHTML = ''
    this.appendChild(svg)
  }

  createSVGElement() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('viewBox', '0 0 100 100')
    svg.setAttribute('width', this.getAttribute('width') || '100%')
    svg.setAttribute('height', this.getAttribute('height') || '100%')
    return svg
  }

  createSectorArc(randomId) {
    const {shape} = this.getAttributes()
    const sectorArc = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    )
    const { strokeWidth, realRadius, sectorColor, gap } = this.getAttributes()
    const angle = this.calculateAngle()
    const { d } = this.calculateArcParameters(angle, realRadius, gap)
    sectorArc.setAttribute('d', d)
    sectorArc.setAttribute('stroke', sectorColor)
    sectorArc.setAttribute('stroke-width', strokeWidth)
    sectorArc.setAttribute('fill', 'transparent')
    sectorArc.setAttribute('vector-effect', 'non-scaling-stroke')
    if (shape !== 'none') {
      sectorArc.setAttribute('marker-end', `url(#head${randomId})`)
      sectorArc.setAttribute('marker-start', `url(#tail${randomId})`)
    }
    

    return sectorArc
  }

  getAttributes() {
    const orbitRadius = parseFloat(
      getComputedStyle(this).getPropertyValue('r') || 0
    )
   
    const gap = parseFloat(
      getComputedStyle(this).getPropertyValue('--o-gap') || 0.001
    )
    const shape = this.getAttribute('shape') || 'none'
    const sectorColor = this.getAttribute('sector-color') || '#00ff00'
    const rawAngle = getComputedStyle(this).getPropertyValue('--o-angle')
    const strokeWidth = parseFloat(
      getComputedStyle(this).getPropertyValue('stroke-width') || 1
    )
    let strokeWithPercentage = ((strokeWidth / 2) * 100) / orbitRadius / 2
    // default aligment at middle
    let innerOuter = strokeWithPercentage
    if (this.classList.contains('outer-orbit')) {
      innerOuter = strokeWithPercentage * 2
    }
    if (this.classList.contains('quarter-outer-orbit')) {
      innerOuter = strokeWithPercentage * 1.75
    }
    if (this.classList.contains('inner-orbit')) {
      innerOuter = 0
    }
    if (this.classList.contains('quarter-inner-orbit')) {
      innerOuter = strokeWithPercentage * 0.75
    }
    const realRadius = 50 + innerOuter - strokeWithPercentage
    const sectorAngle = calcularExpresionCSS(rawAngle)
   
    return {
      orbitRadius,
      strokeWidth,
      realRadius,
      sectorColor,
      gap,
      sectorAngle,
      shape
    }
  }

  calculateAngle() {
    const { sectorAngle, gap } = this.getAttributes()
    return sectorAngle - gap
  }

  calculateArcParameters(angle, realRadius, gap) {
    const radiusX = realRadius / 1
    const radiusY = realRadius / 1
    const startX = 50 + gap + radiusX * Math.cos(-Math.PI / 2)
    const startY = 50 + radiusY * Math.sin(-Math.PI / 2)
    const endX = 50 + radiusX * Math.cos(((angle - 90) * Math.PI) / 180)
    const endY = 50 + radiusY * Math.sin(((angle - 90) * Math.PI) / 180)
    const largeArcFlag = angle <= 180 ? 0 : 1
    const d = `M ${startX},${startY} A ${radiusX},${radiusY} 0 ${largeArcFlag} 1 ${endX},${endY}`
    return { startX, startY, endX, endY, largeArcFlag, d }
  }

  createDefs() {
    // Create <defs> element
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

    return defs;
  }

  createMarker(id, position = 'end') {
    const {
      shape
    } = this.getAttributes()
    // Create <marker> element
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', id);
    marker.setAttribute('viewBox', '0 0 10 10');
    position === 'start' && shape !== 'circle' ? marker.setAttribute('refX', '2'):
    position === 'start' && shape === 'circle' ? marker.setAttribute('refX', '5'):
    marker.setAttribute('refX', '0.1')
    marker.setAttribute('refY', '5');
    marker.setAttribute('markerWidth', '1');
    marker.setAttribute('markerHeight', '1');
    marker.setAttribute('orient', 'auto');
    marker.setAttribute('markerUnits', 'strokeWidth')
    marker.setAttribute('fill', 'context-stroke' )

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const shapes = {
      arrow: {
        head: 'M 0 0 L 2 5 L 0 10 z',
        tail: 'M 2 0 L 0 0 L 1 5 L 0 10 L 2 10 L 2 5 z'
      },
      slash: {
        head: 'M 0 0 L 0 0 L 1 5 L 2 10 L 0 10 L 0 5 z',
        tail: 'M 2 0 L 0 0 L 1 5 L 2 10 L 2 10 L 2 5 z'
      },
      backslash: {
        head: 'M 0 0 L 2 0 L 1 5 L 0 10 L 0 10 L 0 5 z',
        tail: 'M 2 0 L 2 0 L 1 5 L 0 10 L 2 10 L 2 5 z'
      },
      circle: {
        head: 'M 0 0 C 7 0 7 10 0 10 z',
        tail: 'M 6 0 C -1 0 -1 10 6 10 z'
      },
      zigzag: {
        head: 'M 1 0 L 0 0 L 0 5 L 0 10 L 1 10 L 2 7 L 1 5 L 2 3 z',
        tail: 'M 0 0 L 2 0 L 2 5 L 2 10 L 0 10 L 1 7 L 0 5 L 1 3 z'
      }
    }
    position === 'end' ? path.setAttribute('d', shapes[shape].head) :
      path.setAttribute('d', shapes[shape].tail)

  //  path.setAttribute('stroke-width', '0.1');

    // Append <path> to <marker>
    marker.appendChild(path);

    return marker
  }

}