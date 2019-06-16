import Vue from 'vue'
export default () => {
  Vue.directive('loadmore',{
    bind(el,binding,vNode) {
      let scrollPosition = 0;
      el.addEventListener('scroll', function() {
        if(vNode.context.isloadMore) return
        let flagDirection = this.scrollTop - scrollPosition > 0
        scrollPosition = this.scrollTop
        const sign = 10
        const scrollDistance = this.scrollHeight - (this.scrollTop + this.clientHeight) < sign
        if (scrollDistance && flagDirection) {
          binding.value()
        }
      })
    }
  })
}