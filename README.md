# DSS (Doryan Simple Slider)

![photo](pic/DSS.png)

Slider on native javascript and contains nothing extra.

## This is a very simple to use slider.

# How to use?

1. Create a construction in the "body" that looks like this:

```
<div class="slider">
    <div class="gallery">
        <div class="photos">
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
            <div>...</div>
            <div>n</div>
        </div>
    </div>
</div>
```

2. Append in HTML document after tags ```<bodу>...</bodу>``` script tag:

```
<script type="text/javascript" src="scripts/script.js"></script>
```
as shown in the picture:

![photo](pic/2.png)

3. Configure the slider in the CSS file:

```
:root{
    --width: 640px;     //default width
    --height: 400px;    //default height
    --dots-size: 15px;  //default size a dots
}
```
4. Configure the slider in the js file:
```
const settings = {
    transition: "ease-in-out", // default transition for animation
    dots: "on",                // default toggle value
    speedAnimation: 500,       // default speed animation
}
```
5. All ready to go

## What on stady "work in progress"?

- [ ] Support two or more sliders
- [ ] Dots navigation
- [ ] Arrow toggle
- [ ] Endless slider toggle
- [ ] Swipes on smartphones

At the moment I am actively working on it and it works, but it requires some improvements. For the test versions of the slider, I created a separate branch for experiments, and all updates will be uploaded there, and only stable versions will get into this branch.

![photo](/pic/Screenshot%20from%202022-08-15%2019-59-49.png)

## Did you find the bug? Make sure to [leave an issue](https://github.com/doryan04/DSS/issues/new) in case of any problems.

### Check out @tfk004 on Telegram. https://t.me/tfk004
