Page({
    data: {
        length: 4,
    },
    /**输入框聚焦事件 */
    focus({ detail }) {
        console.log('聚焦----' + JSON.stringify(detail))
    },
    /**失焦事件 */
    blur({ detail }) {
        console.log('失焦----' + JSON.stringify(detail))
    },
    /**输入完成 */
    compelete({ detail }) {
        console.log('输入完成----' + JSON.stringify(detail))
        wx.showToast({
            title: `${detail.value}`,
            icon: 'none'
        })
    },
    /**输入 */
    input({ detail }) {
        console.log('输入----' + JSON.stringify(detail))
    }
})