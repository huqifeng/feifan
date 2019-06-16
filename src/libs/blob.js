export default {
    exportFile(res) {
        let blobData = res;
        if (res.data) {
            blobData = res.data
        }
        let blob = new Blob([blobData], {
            type:
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
        });
        let a = document.createElement('a');
        let href = window.URL.createObjectURL(blob) // 创建下载的链接
        a.href = href;
        if (res.data) {
            // 下载后文件名
            let fileName =
                res.headers['content-disposition'] &&
                res.headers['content-disposition'].split('=')[1]
            a.download = decodeURI(fileName)
        }
        document.body.appendChild(a)
        a.click() // 点击下载
        document.body.removeChild(a) // 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放掉blob对象
    }
}
