<template>
    <!-- 修改密码弹框 -->
    <el-dialog title="修改密码" :model="ruleForm" :rules="rules" ref="ruleForm"  :visible.sync="dialogFormVisible" :before-close="beforeClose">
        <el-form :model="ruleForm" size="small" status-icon :rules="rules" ref="ruleForm" :label-width="formLabelWidth" class="demo-ruleForm">
            <el-form-item label="当前账号" prop="currentAccount">
                <el-input autocomplete="off" v-model="userName" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="password">
                <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="再次输入新密码" prop="checkPassword">
                <el-input type="password" v-model="ruleForm.checkPassword" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" @click="modifyPasswordHandler">保 存</el-button>
        </div>
    </el-dialog>
</template>
<style lang="scss">

</style>
<script>
import { employee_modifyPassword } from '@/api/permissions'
export default {
    name: "modifyPassword",
 
    props: {
        passwordModal: {
            type: Boolean,
            default: true
        },
        //修改密码父组件来的值
        info:{
            type: Object,
            default: {}
        }
    },
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入新密码'));
            } else {
              if (this.ruleForm.checkPassword !== '') {
                this.$refs.ruleForm.validateField('checkPassword');
              }
              callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入新密码'));
            } else if (value !== this.ruleForm.password) {
              callback(new Error('两次输入密码不一致!'));
            } else {
              callback();
            }
        };
        return {
            dialogFormVisible: this.passwordModal,
            formLabelWidth: '140px',
            userName:this.info.userName,
            id:this.info.id ,
            ruleForm: {
                password: '',
                checkPassword: ''
            },
            rules: {
                password: [
                    { required: true, message: "请输入新密码", trigger: "blur" },
                    {
                        pattern: /^(?![^A-z]+$)(?!\D+$)[A-z\d]{8,15}$/,
                        message: '请输入8-15位数字加字母组合',
                    },
                ],
                checkPassword: [
                    { required: true, message: "请再次输入新密码", trigger: "blur" },
                    {
                        pattern: /^(?![^A-z]+$)(?!\D+$)[A-z\d]{8,15}$/,
                        message: '请输入8-15位数字加字母组合',
                    },
                ],
            }
            
        }
    },
    methods: {
        //修改密码提交
        modifyPasswordHandler() {
            //console.log(this.info.id)  //获取到props内部的值
            this.$refs["ruleForm"].validate((valid) => {
                // if(!valid) return
                if (valid) {
                   employee_modifyPassword({
                        id: this.id,
                        password : this.$encrypt(this.ruleForm.password).toString()
                    }).then(res => {
                        this.$message({
                            message: '保存成功！',
                            type: 'success'
                        });
                        //this.$utils.setSession('id',res.body.id)
                        //this.$utils.setSession('id',res.body.userName)
                        this.closeDialog();
                        console.log(res.body.id)
                        console.log(res.body.userName)
                    })
                } else {
                    this.$message({
                        message: '保存失败！',
                        type: 'error'
                    });
                }
            })
        },
        closeDialog() {
            this.$emit('update:passwordModal',false)
            this.dialogFormVisible = false;
        },
        beforeClose(done) {
            this.$emit('update:passwordModal',false)
            done()
        }
    }
    
}
</script>

