/*  
**  Thanks to:
**  https://codepen.io/Goweb/pen/qNBQya
*/

<template>
  <vue-draggable-resizable
    class="resize"
    @dragging="onDrag"
    :h="70"
    drag-handle=".addon"
    :resizable="false"
    axis="y"
    :y="10"
  >
    <div :class="{expanded: is_expanded}" class="addon" :style="{'top': y || 10}">
      <div :class="{hidden: is_hidden, hide: hide}" class="notification">
        <ShortLogo class="shortnim-logo" @click="toggle"/>
        <ShortnimInfo :style="spacing" />
      </div>
      <div :class="{container: true, close: is_closed}" @click="toggle" class="close-btn">
        <NimHexagon v-if="is_shown" class="nq-icon"/>
        <NimClose v-else class="nq-icon"/>
      </div>
    </div>
  </vue-draggable-resizable>
</template>


<script>
import NimHexagon from "../icons/hexagon.svg";
import NimClose from "../icons/close.svg";
import ShortLogo from "../icons/shortnim-logo.svg";

import ShortnimInfo from "@/components/ShortnimInfo";

// For faster development
let default_expanded = true;

export default {
  name: "ShortNIM_addon",
  components: {
    NimHexagon,
    NimClose,
    ShortLogo,
    ShortnimInfo,
    ShortnimText
  },
  data() {
    return {
      is_closed: false,

      is_expanded: default_expanded,
      is_hidden: !default_expanded,
      //is_closed: default_expanded,
      is_shown: !default_expanded,
      hide: !default_expanded,
      spacing: !default_expanded
        ? "white-space: nowrap;"
        : "white-space: normal;",
      y: 0
    };
  },
  methods: {
    onDrag: function(x, y) {
      this.y = y
    },
    toggle() {
      if (this.is_closed) {
        this.openNotification();
      } else {
        this.closeNotification();
      }
      this.is_closed = !this.is_closed;

      /*this.is_expanded = !this.is_expanded;
      this.is_hidden = !this.is_hidden;
      this.is_closed = !this.is_closed;

      // Show Close ICON only if full screen, if not Nimiq ICON
      this.is_shown = !this.is_shown;
      this.hide
        ? setTimeout(() => (this.spacing = "white-space: normal;"), 450)
        : (this.spacing = "white-space: nowrap;");
      !this.hide
        ? setTimeout(() => (this.hide = !this.hide), 800)
        : (this.hide = !this.hide);*/
    },
    openNotification() {
      const addon = document.querySelector(".addon");
      const shortnimLogo = document.querySelector(".shortnim-logo");
      const closeBtn = document.querySelector(".close-btn");
      const notification = document.querySelector(".notification__info");
      shortnimLogo.style.transform = "scale(1.09)";
      addon.style.transform = "scale(1)";
      if(window.innerWidth < 630){
          shortnimLogo.style.opacity = '0';
      }
      setTimeout(() => {
        notification.style.visibility = "visible";
        addon.style.width = "calc(100vw - var(--nimiq-lateral-margin) * 2)";
        addon.style.background = "#fff";
        addon.style.boxShadow = " 0 4px 64px rgba(0, 0, 0, 0.15)";
        closeBtn.style.opacity = 1;
        shortnimLogo.style.left = "-20px";
        if(window.innerWidth < 630){
          shortnimLogo.style.display = 'none';
        }
      },300);      
      setTimeout(() => {
        notification.style.opacity = 1;        
      }, 700)
    },
    closeNotification() {
      const addon = document.querySelector(".addon");
      const shortnimLogo = document.querySelector(".shortnim-logo");
      const closeBtn = document.querySelector(".close-btn");
      const notification = document.querySelector(".notification__info");
      notification.style.opacity = 0;
      setTimeout(() => {
        notification.style.visibility = "hidden";
        addon.style.width = "70px";
        notification.style.opacity = 0;
        closeBtn.style.opacity = 0;
        shortnimLogo.style.left = 0;
        shortnimLogo.style.display = 'inherit';
        
      }, 300)
      setTimeout(() => {
        if(window.innerWidth < 630){
          shortnimLogo.style.opacity = '1';
        }
        shortnimLogo.style.transform = "scale(.8)";
        addon.style.transform = "scale(.6)";        
      }, 700)
    }
  }
};
</script>

// Style
<style lang="less" scoped>
html {
  .addon {
    position: fixed;
    --nimiq-lateral-margin: 10px;
    right: 10px;
    padding: 5px 15px;
    z-index: 100000;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    height: 55px;
    width: calc(100vw - var(--nimiq-lateral-margin) * 2);
    max-width: 570px;
    border-radius: 5px;
    background: #fff;
    box-shadow: 0 4px 64px rgba(0, 0, 0, 0.15);
    transition: .6s all ease;
    line-height: 1;
    cursor: grab;

    &.expanded {
      height: 70px;
    }

    .notification {
      max-height: 73px;
      font-size: 2vw;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      text-align: center;
      visibility: visible;
      opacity: 1;
      transition: 0.3s;
      overflow: hidden;

      &:nth-of-type(1) {
        transition-delay: 0.4s;
      }
      &:nth-of-type(2) {
        transition-delay: 0.5s;
      }
      &:nth-of-type(3) {
        transition-delay: 0.6s;
      }
      &:nth-of-type(4) {
        transition-delay: 0.7s;
      }

      &.hidden {
        width: 0;
        visibility: hidden;
        opacity: 0;
        text-overflow: ellipsis;

        &:nth-of-type(1) {
          transition-delay: 0.3s;
        }
        &:nth-of-type(2) {
          transition-delay: 0.2s;
        }
        &:nth-of-type(3) {
          transition-delay: 0.1s;
        }
        &:nth-of-type(4) {
          transition-delay: 0s;
        }
      }

      .shortnim-logo {
        position: absolute;
        width: 70px;
        height: 70px;
        left: -20px;
        transform: scale(1.09);
        transition: .3s all ease;
      }
    }

    .container {
      width: 24px;
      height: 24px;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      cursor: pointer;
    }

    .nq-icon {
      width: 24px;
      height: 24px;
    }

    .hide {
      display: none !important;
    }
  }

  @media screen and (max-width: 630px) {
    .addon {
      padding: 5px;

      .notification {
        flex-direction: column-reverse;
        justify-content: space-between;
        height: 100%;
        margin: 5px 0;

        .shortnim-logo {
          display: none;
        }
      }

      .container {
        transform: scale(0.7);
      }
    }
  }
}

.resize {
  transition: 0.1s top cubic-bezier(1, 0.9, 0.45, 1.15);
  // ease-in-out
}
</style>
