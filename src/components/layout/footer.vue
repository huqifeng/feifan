<template>
  <footer class="main-footer">
    <div class="copyright">Copyright &copy;{{new Date().getFullYear()}} 非影科技技术部出品</div>
  </footer>
</template>

<script>
export default {}
</script>
<style lang="scss" scoped>
.main-footer {
  padding: 30px 20px;
  text-align: center;
  .link {
    margin-bottom: 8px;
    a {
      margin: 0 20px;
      color: rgba(0, 0, 0, 0.45);
    }
  }
  .copyright {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.45);
  }
}
</style>
