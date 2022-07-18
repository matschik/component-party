Using [location.hash](https://developer.mozilla.org/en-US/docs/Web/API/Location/hash)

```html
<nav>
    <a href="#">Index</a>
    <a href="#contact">Contact Us</a>
</nav>
<div x-data="{page: location.hash}" @hashchange.window="page = location.hash">
    <span x-show="page === ''">
        <h1>Welcome</h1>
    </span>
    <span x-show="page === '#contact'">
        <p>
        <ul>
            <li>Lorem ipsum dolor</li>
            <li>amet consectetur adipisicing elit</li>
        </ul>
        </p>
    </span>
</div>
```