// Global Strict Mode
'use strict';





/**
 * @var obj- Object containing the Slides and Current Slide Index
 */
const obj = {
    /**@this this.slides - Spreads the DOMList of Slides into an Array */
    slides : [...document.querySelectorAll('.slide')],
    /**@this this.index - Keeps the Index of the Current Slide */
    index : 0,
}
/**
 * @function next - Calls the Next Slide
 * @description 
 * Increases the Index by One each time 
 * Checks the Index to keep it within the range of the Slides
 * Checks to see if every other slide is hidden
 */
function next(){
    ++obj.index;
    checkIndex();
    checkHidden();
    console.log(obj.index);
}

/**
 * @function prev - Calls the Prev Slide
 * @description 
 * Increases the Index by One each time 
 * Checks the Index to keep it within the range of the Slides
 * Checks to see if every other slide is hidden
 */
function prev(){
    --obj.index;
    checkIndex();
    checkHidden();
    console.log(obj.index);
    
}

/**
 * @function checkIndex - Keeps the Index within the range of the Array of Slides
 * @description
 * This function is to keep the Slide Index as it changes to keep itself within 
 * the confines of the array. There is a few use cases that this addresses:
 * 1) As the Index increments beyond the last entry of the Array,
 * 2) As you work backwards through the array, after 0 the Index should be 
 * corrected to the length of the Array, 
 */
function checkIndex(){
    if(obj.index > obj.slides.length-1){
        return obj.index = 0;
    }else if( obj.index < 0){
        return obj.index = obj.slides.length - 1;
    }else{
        return obj.index;
    }
}
/**
 * @function checkHidden - Checks if the Slides are Hidden from View
 * @description 
 * This function takes the current Index as the Index of the Slide that 
 * is visible, checks against the other slides to make sure that they are 
 * invisible. 
 */
function checkHidden(){
    let activeIndex = checkIndex();
    for(let i = 0; i < obj.slides.length; ++i){
        let classList = obj.slides[i].classList
        if(i != activeIndex){
            let containsHidden = classList.contains('hidden');
            if(!containsHidden){
                classList.add('hidden')
            }
        }else{
            classList.remove('hidden')
        }
    }
}

