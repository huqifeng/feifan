<template>
  <!-- 备注 -->
  <div class="remark-item" v-if="data.type === '1'">
    <div class="remark-item__hd">
      <span class="t1">ID：{{data.id}}</span>
    </div>
    <div class="remark-item__bd">
      <div class="content">
        <div class="field">
          <div class="lable">备注内容：</div>
          <div class="value">{{data.content}}</div>
        </div>
        <div class="field">
          <div class="lable">批注人：</div>
          <div class="value">{{data.realname}}</div>
        </div>
        <div class="field">
          <div class="lable">记录日期：</div>
          <div class="value">{{data.create_time}}</div>
        </div>
      </div>
    </div>
    <div class="remark-item__ft">
      <div class="comment">
        <div class="comment-item" v-for="child in data.child" :key="child.id">
          <div class="pic"></div>
          <div class="content">
            <p class="name">{{child.realname}}</p>
            <p class="text">{{child.content}}</p>
            <p class="time">{{child.create_time}}</p>
          </div>
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
  <!-- 批注 -->
  <div class="remark-item" v-else>
    <div class="remark-item__hd">
      <span class="t1">ID：{{data.id}}</span>
      <span class="t2">文件名称：{{data.file_name}}</span>
      <span class="t3" v-if="data.file_status === '0'">(使用中)</span>
    </div>
    <div class="remark-item__bd">
      <div class="pic" v-if="data.file_image">
        <a :href="data.file_image | imageUrl" target="_blank">
          <el-image :src="data.file_image | imageUrl" fit="cover"></el-image>
        </a>
      </div>
      <div class="content">
        <div class="field" v-if="data.postil_time">
          <div class="lable">批注时间：</div>
          <div>{{data.postil_time}}</div>
        </div>
        <div class="field">
          <div class="lable">批注人：</div>
          <div>{{data.realname}}</div>
        </div>
        <div class="field">
          <div class="lable">记录日期：</div>
          <div>{{data.create_time}}</div>
        </div>
        <div class="field" v-if="!data.file_image">
          <div class="lable">备注内容：</div>
          <div class="value">{{data.content}}</div>
        </div>
      </div>
    </div>
    <div class="remark-item__ft">
      <div class="field" v-if="data.file_image" style="margin-bottom:10px;">
        <div class="lable">备注内容：</div>
        <div class="value">{{data.content}}</div>
      </div>
      <div class="comment">
        <div class="comment-item" v-for="child in data.child" :key="child.id">
          <div class="pic"></div>
          <div class="content">
            <p class="name">{{child.realname}}</p>
            <p class="text">{{child.content}}</p>
            <p class="time">{{child.create_time}}</p>
          </div>
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RemarkItem',
  props: { data: Object }
}
</script>

<style lang="scss">
.remark-item {
  margin-bottom: 20px;
  padding: 20px;
  background: #fff;
  box-shadow: 0px 0px 5px 0px rgba(23, 155, 255, 0.3);
  .remark-item__hd {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    .t1 {
      font-size: 16px;
      font-weight: bold;
    }
    .t2 {
      margin-left: 30px;
      font-size: 16px;
      font-weight: bold;
    }
    .t3 {
      margin-left: 20px;
      font-size: 14px;
      font-weight: bold;
      color: #179bff;
    }
  }
  .remark-item__bd {
    display: flex;
    padding-bottom: 10px;
    .pic {
      width: 220px;
      height: 124px;
      margin-right: 20px;
      .el-image {
        width: 100%;
        height: 100%;
      }
    }
    .content {
      flex: 1;
    }
  }
  .field {
    display: flex;
    line-height: 30px;
    .lable {
      width: 80px;
      font-size: 16px;
      color: #333;
      text-align: right;
    }
    .value {
      flex: 1;
      font-size: 14px;
      line-height: 30px;
      color: #333;
    }
  }
  .comment-item {
    display: flex;
    padding: 12px 0;
    border-top: solid 1px #f1f1f1;
    .pic {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      overflow: hidden;
      border: 1px solid #f2f2f2;
    }
    .content {
      flex: 1;
      padding-left: 10px;
      overflow: hidden;
      .name {
        color: #666;
      }
      .text {
        line-height: 30px;
      }
      .time {
        color: #999;
      }
    }
  }
}
</style>
