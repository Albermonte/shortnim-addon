<template>
  <div>
    <input type="checkbox" id="navigation-toggle">
    <div class="wrap">
      <div class="navbar">
        <ul>
          <li>Lorem ipsum dolor sit amet consectetur, adipiscing elit per dictum, ut eleifend ad arcu.</li>
        </ul>
      </div>
      <label for="navigation-toggle">Menu</label>
    </div>
  </div>
</template>

<script>
export default {
  name: "NimiqFunder",
  data() {
    return {};
  },
  created() {},
  methods: {
    openShortNIM() {
      window.open("https://shortnim.me/", "_blank");
    }
  }
};
</script>

<style lang="sass" scoped>
$blue: #82b1ff

@keyframes toggle-navbar
  0%
    top: -70px
  100%
    top: 0
  
@keyframes move-label
  0%
    top: 0px
  100%
    top: 70px

html, body 
  padding: 0
  margin: 0
  background-color: grey
  
.navbar
  position: absolute
  top: -70px
  left: 0
  width: 100%
  height: 70px
  text-align: center
  background-color: $blue
  padding: 0
  
  li 
    list-style-type: none
    font-family: sans-serif
    text-transform: uppercase
    color: whitesmoke
    display: inline-block
    padding: 10px

label
  position: absolute
  width: 50px
  margin: auto
  top: 0px
  right: 0px
  text-align: center
  text-decoration: none
  text-transform: uppercase
  font-family: sans-serif
  color: whitesmoke 
  background-color: $blue
  padding: 10px 20px
  cursor: pointer
  border-bottom-left-radius: 5px
  border-bottom-right-radius: 5px
  
#navigation-toggle 
  display: none

  &:checked + .wrap
    
    .navbar 
      animation-name: toggle-navbar
      animation-duration: 0.5s
      animation-fill-mode: forwards
    
    label
      animation-name: move-label
      animation-duration: 0.5s
      animation-fill-mode: forwards
    
</style>


