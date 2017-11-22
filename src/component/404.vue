<template>
    <div>
        <div id="no-found">
            <div class="img-box">
                <img src="~images/404.png" alt=""/>
            </div>
            <p>从前有座山，山里有座庙，</p>
            <p>庙里有个页面，现在找不到...</p>
            <p v-if="isNodd()" style="color:#0B95F5;">请在移动端钉钉打开此页面</p>
        </div>
    </div>
</template>

<script scoped>
    export default {
        data() {
            return {}
        },
        activated: function () {
            Bestone.ui.pageInit({
                setTitle: '程序猿和妹妹跑了！'
            });
        },
        methods: {
            // 是否在钉钉
            isNodd: function () {
                if(!!dd.version) {
                    return false;
                }
                return true;
            }
        }
    }
</script>

<style lang="scss" scoped>
    #no-found {
        & > .img-box {
            width: 50%;
            padding-top: 30%;
            margin: 0px auto 0px;
            & > img {
                width: 100%;
            }
        }
        & > p {
            font-size: 14px;
            text-align: center;
            color: #666;
        }
    }
</style>