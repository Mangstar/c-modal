# C-Modal

Simple native js modal component

  - Three sections for content
  - Custom show (hide) animation
  - Chaining

# Instance
```javascript
const modal = new CModal([options?]);

modal.create() - create an instance of a modal
modal.open() - show modal
```
# Chaining
You can chain methods
```javascript
new CModal()
    .create()
    .setHeader('<h2>CModal title</h2>')
    .setContent('<div>Content here</div>')
    .open()
```

# Instance options
| Option  | Description | Type | Default |
| ------------- | ------------- | ------------- | ------------- |
| width  | Width of a modal  | String | auto
| closeVars  | Ways you can close a modal  | Array[String] | ['button', 'esc', 'overlay']
| showHeader  | Render modal part "Header"  | Boolean | true
| showFooter  | Render modal part "Footer"  | Boolean | true
| showAnim  | Animation of a emergence modal. You can set a custom animation. Just describe a new @keyframes block in your css code and point it here | String | 'show-in'
| hideAnim  | Animation of a hiding modal. You can set a custom animation. Just describe a new @keyframes block in your css code and point it here  | String | 'show-out'
| modalClass  | Custom class for a modal  | Array[String], String | null

# Public API
| Method  | Description | Args | Type | Returns |
| ------------- | ------------- | ------------- | ------------- | -------------|
| create  | Create an instance of a modal  | --- | ---| Instance
| destroy  | Delete an instance of a modal  | --- | --- | --- |
| open  | Show modal  | --- | --- | Instance |
| close  | Hide modal  | --- | ---|  --- |
| setHeader  | Set header content part of a modal  | content | String or HTMLElement | Instance |
| setContent  | Set main content part of a modal  | content | String or HTMLElement | Instance |
| setFooter  | Set footer content part of a modal  | content | String or HTMLElement | Instance |
| clearHeader  | Clear header content part of a modal  | --- | ---| Instance |
| clearContent  | Clear main content part of a modal  | --- | --- | Instance |
| clearFooter  | Clear footer content part of a modal  | --- | --- | Instance |
| replaceHeader  | Replace header content part of a modal  | content | String or HTMLElement | Instance |
| replaceContent  | Replace main content part of a modal  | content | String or HTMLElement | Instance |
| replaceFooter  | Replace footer content part of a modal  | content | String or HTMLElement | Instance |

# Static CModal API
| Method  | Description | Args | Type | Returns |
| ------------- | ------------- | ------------- | ------------- | -------------|
| getModal  | Get an instance of CModal or undefined, if there's no one  | id | Number, String | Instance, undefined

Modal.getModal(id) - get an instance CModal by id

License
----

MIT


**Free Software, Hell Yeah!**
