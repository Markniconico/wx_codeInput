Component({
    behaviors: ['wx://component-export'],
    /**
     * 组件的属性列表
     */
    properties: {
        /**传入的初始值 */
        value: {
            type: [String, Number],
            value: '',
        },
        /**输入块数量 */
        length: {
            type: [String, Number],
            value: 0,
        },
        /**组件背景颜色 */
        backgroundColor: {
            type: String,
            value: '#fff'
        },
        /**是否自动聚焦于首个输入块 */
        autoFocus: Boolean,
        /**是否为密码类型 */
        password: Boolean,
        /**点击输入块时，是否删除原有值 */
        inputAreaItemTapClear: {
            type: Boolean,
            value: true,
        },
        /**输入块之间间距 */
        spacing: {
            type: String,
            value: '10rpx',
        },
        /**输入块宽度 */
        inputAreaItemWidth: {
            type: String,
            value: '80rpx',
        },
        /**输入块高度 */
        inputAreaItemHeight: {
            type: String,
            value: '80rpx',
        },
        /**每个输入块圆角 */
        inputAreaItemRadius: {
            type: String,
            value: '10rpx',
        },
        /**每个输入块的背景颜色 */
        inputAreaItemBackgroundColor: {
            type: String,
            value: '#EBF1FF',
        },
        /**每个输入块的文字颜色 */
        inputAreaItemFontColor: {
            type: String,
            value: '#3d3d3d',
        },
        /**光标颜色 */
        cursorColor: {
            type: String,
            value: '#3d3d3d',
        },
        /**focus时，点击页面的时候不收起键盘 */
        holdKeyboard: {
            type: Boolean,
            value: true,
        },
        /**键盘弹起时，是否自动上推页面 */
        adjustPosition: {
            type: Boolean,
            value: false,
        }
    },
    /**
     * 组件的生命周期
     */
    lifetimes: {
        // 在组件实例进入页面节点树时执行
        attached: function() {

            const { length, autoFocus } = this.data
            let inputInfo = []
            for (let i = 0; i < parseInt(length); i++) {
                inputInfo.push({
                    value: ''
                })
            }

            let setObj = { inputInfo }
            let value = this.data.value.toString()


            const valueIsValid = !isNaN(Number(value)) && value !== ''

            if (valueIsValid) {
                let copyValue = value
                copyValue.split('').forEach((value, index) => {
                    setObj.inputInfo[index].value = value
                })

                Object.assign(setObj, { inputValue: value })
            }

            autoFocus && Object.assign(setObj, {
                active: valueIsValid ? value.length : 0,
                keyboard: true
            })

            this.setData(setObj)
        },
    },
    /**
     * 组件的初始数据
     */
    data: {
        inputInfo: [],
        active: '',
        keyboard: false,
        inputValue: '', //input输入框实时的值
    },
    /**
     * 组件的方法列表
     */
    methods: {
        /**点击整个区域 */
        clickComponentsArea() {
            if (this.data.keyboard) {
                this.setData({ keyboard: false })
            }
        },
        /**点击每个输入块 */
        clickInputBlock(e) {
            const { index } = e.currentTarget.dataset
            this.setData({ active: index })

            if (!this.data.keyboard) {
                this.setData({ keyboard: true })
            }

            /**是否清除该项值（由外部传入） */
            if (this.data.inputAreaItemTapClear) {

                /**如果被点击的输入块有值，清除原来的值 */
                if (this.data.inputInfo[index].value) {
                    this.setData({
                        ['inputInfo[' + index + '].value']: ''
                    })

                    const currentValue = this.getCurrentValue()

                    this.setData({ inputValue: currentValue })
                }
            }
            this.triggerEventManage('focus')

        },
        /**输入框输入 */
        input(e) {
            const value = e.detail.value.toString()

            if (isNaN(Number(value))) return
            let { active, inputInfo, inputValue } = this.data

            if (inputValue.length <= value.length) {

                /**当前光标已有值，不做任何操作，返回的值将替换输入框的内容 */
                if (inputInfo[active].value) return inputValue

                let diff = this.getDiff(inputValue, value)

                this.setData({
                    ['inputInfo[' + active + '].value']: diff,
                    inputValue: value
                })


                if (active === inputInfo.length - 1 || inputInfo.every(item => { return item.value })) {
                    /**最后一个输入块，收起键盘 */
                    wx.hideKeyboard()
                    this.triggerEventManage('confirm')
                } else {
                    /**聚焦于下一个输入块 */
                    active++
                    this.setData({ active })
                }

            } else {
                //删除操作
                if (inputInfo[active].value === '') return inputValue

                this.setData({
                    ['inputInfo[' + active + '].value']: '',
                    inputValue: value
                })
            }

            this.triggerEventManage('input')
        },
        triggerEventManage(field) {
            const currentValue = this.getCurrentValue()
            this.triggerEvent(field, {
                active: this.data.active,
                value: currentValue
            })
        },
        /**输入框失焦事件 */
        blur(event) {
            this.setData({ keyboard: false })
            this.triggerEventManage('blur')
        },
        getDiff(v1, v2) {
            let v1Length = v1.length
            let v2Length = v2.length

            if (v1Length > v2Length) {
                return v1[v1Length - 1]
            } else if (v1Length < v2Length) {
                return v2[v2Length - 1]
            } else {
                return ''
            }
        },
        /**获取组件的值 */
        getCurrentValue() {
            return this.data.inputInfo.reduce((current, nextItem) => {
                return current + nextItem.value
            }, '')
        },
    },
    /**组件被 selectComponent 调用时的返回值 */
    export () {
        return {
            isFocus: this.data.keyboard,
            active: this.data.active,
            getValue: () => {
                return this.getCurrentValue()
            },
            closeKeyboard: () => {
                wx.hideKeyboard()
            },
        }
    },
})