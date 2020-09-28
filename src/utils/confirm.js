import { MessageBox } from 'element-ui'
export default class MessageTips {
    constructor(fn) {
        this.status = 'pending';
        this.confirmFn = [];
        this.alertFn = [];
        this.promotFn = [];
        const confirm = ({ content: content = "确认操作?", tip: tip = "提示", type: type = "warning" } = { content: "确认操作?", tip: "提示", type: "warning" }) => {
            if (this.status == 'pending') {
                this.content = content;
                this.tip = tip;
                this.type = type;
                this.status = 'confirm';
                this.confirmFn.forEach(item => { item() })
            }
        }
        const alert = ({ content: content = "确认操作?", tip: tip = "提示", type: type = 'warning' } = { content: "确认操作?", tip: "提示", type: "warning" }) => {
            if (this.status == 'pending') {
                this.content = content;
                this.tip = tip;
                this.type = type;
                this.status = "alert";
                this.alertFn.forEach(item => { item() })
            }
        }
        const promot = ({ content: content = "确认操作?", tip: tip = "提示", type: type = "warning" } = { content: "确认操作?", tip: "提示", type: "warning" }) => {
            if (this.status == 'pending') {
                this.content = content;
                this.tip = tip;
                this.type = type;
                this.status = 'promot';
                this.promotFn.forEach(item => { item() })
            }
        }
        fn({ confirm, alert, promot })
    }
    confirm(callback) {
        MessageBox.confirm(this.content, this.tip, { closeOnClickModal: false, confirmButtonText: "确定", cancelButtonText: "取消", type: this.type }).then(() => { callback() }).catch(() => { })
    }
    alert(callback) {
        MessageBox.alert(this.content, this.tip, { confirmButtonText: "确定", type: this.type }).then(() => { callback() }).catch(() => { })
    }
    promot(callback) {
        MessageBox.prompt(this.content, this.tip, { confirmButtonText: "确定", cancelButtonText: "取消", type: this.type }).then((value) => { callback(value) })
    }
    then(callback) {
        if (this.status === 'pending') {
            this.confirmFn.push(callback);
            this.alertFn.push(callback);
            this.promotFn.push(callback);
        }
        if (this.status === 'confirm') {
            this.confirm(callback)
        }
        if (this.status === 'alert') {
            this.alert(callback)
        }
        if (this.status === 'promot') {
            this.promot(callback)
        }
    }
} 