<template>
  <div class="text">
    <p>
      <a href="http://shortnim.me/" target="_blank">ShortNIM</a> is a service that allow users to shorten URL which when clicked will open a Nimiq Miner that will provide hash power to the owner of the original link.
       (If I'm bothering you, you can drag me)
    </p>
  </div>
</template>

<script>
export default {
  name: "ShortnimText"
};
</script>


<style lang="less" scoped>
.text {
  font-family: Muli, system-ui, sans-serif !important;

  p {
    flex: 1;
    text-align: justify;
    line-height: 1.1;
    font-size: 13px;
    margin: 0;
    margin-right: 20px;
  }

  a {
    text-decoration: none;
    font-weight: bold;
    color: #0582ca;
  }
}

@media screen and (max-width: 630px) {
  .text {
    p {
      font-size: 11px;
      margin: 6px 5px 4px 0;
    }
  }
}
</style>
