var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
//挂机界面动画
var com_main;
(function (com_main) {
    var AwayKeyboardView = /** @class */ (function (_super_1) {
        __extends(AwayKeyboardView, _super_1);
        function AwayKeyboardView() {
            var _this = _super_1.call(this) || this;
            _this.m_effectAction = 1;
            _this.m_enemyGenList = [];
            _this.CLEAR_TIME = 0;
            _this.m_bitmapTextList = [];
            _this.m_generalImg = [];
            _this.curIndex = 0;
            _this.name = AwayKeyboardView.NAME;
            _this.initApp("patrol/AwayKeyboard.exml");
            _this.position = [];
            _this.position[1] = [];
            _this.position[2] = [];
            _this.position[1][1] = new com_main.Point(-120, 107);
            _this.position[1][2] = new com_main.Point(-411 + 40, 33);
            _this.position[1][3] = new com_main.Point(-262, 232);
            _this.position[1][4] = new com_main.Point(28, 79);
            _this.position[2][1] = new com_main.Point(-115, 114);
            _this.position[2][2] = new com_main.Point(28, 180);
            _this.position[2][3] = new com_main.Point(-168 - 30, 186);
            _this.position[2][4] = new com_main.Point(-230, 0);
            _this.CLEAR_TIME = TimerUtils.getServerTime();
            RoleData.isCreateAccount = false;
            return _this;
        }
        AwayKeyboardView.getInstance = function () {
            if (!AwayKeyboardView._instance) {
                AwayKeyboardView._instance = new AwayKeyboardView();
            }
            return AwayKeyboardView._instance;
        };
        AwayKeyboardView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.createEffect();
            this.width = GameConfig.curWidth();
            // platform.reportData(ReportType.enterServer);
            platform.reportLogin();
        };
        AwayKeyboardView.prototype.createEffect = function () {
            this.m_isLoad = false;
            //场景创建完成
            var effectMC = new MCDragonBones();
            this.m_effectMC = effectMC;
            effectMC.initAsync("cjjz");
            effectMC.bindInitCallback(this.initCallbcak, this);
            effectMC.setCallback(this.effectEndCallback, this);
            this.m_effectAction = RandomUtils.getInstance().limitInteger(1, 2);
            effectMC.addDBEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT, this.frame_event, this);
            this.effectNode.addChild(effectMC);
            this.initData();
            this.m_isLoad = true;
        };
        /**界面弹窗变动 */
        AwayKeyboardView.prototype.onPopPanelUpdate = function (isAction) {
            if (this.m_effectMC) {
                if (isAction) {
                    if (!this.m_effectMC.isPlaying)
                        this.m_effectMC.play("cjjz_" + this.m_effectAction, 0, false, true);
                }
                else
                    this.m_effectMC.stop();
            }
        };
        AwayKeyboardView.prototype.initData = function () {
            this.visible = true;
            if (this.m_effectMC) {
                this.m_effectMC.play("cjjz_" + this.m_effectAction, 0);
                com_main.EventMgr.addEvent(LegionEvent.LEGION_INFO_CHANGE, this.changeMyTitle, this);
                com_main.EventMgr.addEvent(NormalEvent.POP_PANEL_UPDATE, this.onPopPanelUpdate, this);
                this.randomGeneralList = [];
                var thumImage = "";
                var mapSrc = PatrolModel.info.map.slice(0, -3);
                thumImage = mapSrc + 's_png';
                this.m_thumImg.source = thumImage;
                SceneManager.sceneCreateComplete();
                if (this.m_isLoad) {
                    this.initCallbcak();
                    this.changeGeneral1();
                }
                //设置地图
                if (this.m_pBg) {
                    this.m_pBg.source = PatrolModel.info.map;
                }
            }
            else if (this.m_isLoad) {
                this.createEffect();
            }
        };
        AwayKeyboardView.prototype.onDestroy = function () {
            /**15分钟清理一次 */
            var time = TimerUtils.getServerTime();
            if (time - this.CLEAR_TIME >= 900) {
                this.CLEAR_TIME = TimerUtils.getServerTime();
                if (this.m_effectMC) {
                    this.m_effectMC.destroy();
                    this.m_effectMC = null;
                    this.m_pBg = null;
                    this.m_title = null;
                }
            }
            else {
                if (this.m_effectMC) {
                    this.m_effectMC.stop();
                }
            }
            this.visible = false;
            // EventMgr.removeEventByObject(EventEnum.RANDOM_GENERAL_END, this);
            com_main.EventMgr.removeEventByObject(LegionEvent.LEGION_INFO_CHANGE, this);
            com_main.EventMgr.removeEventByObject(NormalEvent.POP_PANEL_UPDATE, this);
            Utils.TimerManager.remove(this.randomGeneral, this);
            //清理模块资源 最后调用 避免龙骨动画没有执行destroy
            // SceneResGroupCfg.clearModelRes([ModuleEnums.AKB]);
            if (this.m_pBg) {
                this.m_pBg.source = "guaji_map_1_s_png";
            }
            // this.recovery();
        };
        AwayKeyboardView.prototype.cleanObj = function () {
            if (this.m_effectMC) {
                this.m_effectMC.destroy();
                this.m_effectMC = null;
                this.m_pBg = null;
                this.m_title = null;
            }
        };
        AwayKeyboardView.prototype.initCallbcak = function () {
            // this.createWalkGeneral();
            this.randomGeneral();
            Utils.TimerManager.doTimer(3000, 0, this.randomGeneral, this);
            this.changeBgImage();
        };
        AwayKeyboardView.prototype.effectEndCallback = function () {
            this.m_effectAction = this.m_effectAction + 1;
            if (this.m_effectAction > 2) {
                this.m_effectAction = 1;
            }
            this.m_effectMC.play("cjjz_" + this.m_effectAction, 0);
            // this.changeGeneral1();
        };
        AwayKeyboardView.prototype.changeMyTitle = function () {
            var isRefresh = true;
            if (!this.m_title) {
                this.m_title = new com_main.GeneralHeadTitle();
                isRefresh = false;
            }
            var factionName = LegionModel.getGuildName(true);
            if (factionName != '') {
                factionName = factionName + "【" + LegionModel.getPlayerPosDes() + "】";
            }
            this.m_title.setData({ countryId: RoleData.countryId, name: RoleData.nickName, factName: factionName, isSelf: true });
            if (isRefresh) {
                this.m_title.refreshView();
            }
        };
        AwayKeyboardView.prototype.changeBgImage = function () {
            if (!this.m_pBg) {
                this.m_pBg = new eui.Image();
                this.m_pBg.source = PatrolModel.info.map;
                this.m_pBg.width = 2213;
                this.m_pBg.height = 1080;
                this.m_effectMC.setSlotDisplay("db", this.m_pBg);
                this.changeMyTitle();
                this.m_effectMC.setSlotDisplay("weilvbu", this.m_title, 0, 40);
                this.changeGeneral1();
                this.setFireImage();
                this.setFireStoneImage();
                this.changeSkillImage();
                this.changeGeneralCC();
            }
            else {
                this.m_pBg.source = PatrolModel.info.map;
            }
        };
        /**回收到对象池 */
        AwayKeyboardView.prototype.recovery = function () {
            for (var _i = 0, _a = this.m_bitmapTextList; _i < _a.length; _i++) {
                var text = _a[_i];
                // ObjectPool.push(text);
            }
            for (var _b = 0, _c = this.m_generalImg; _b < _c.length; _b++) {
                var img = _c[_b];
                ObjectPool.push(img);
            }
            this.m_bitmapTextList = [];
            this.m_generalImg = [];
        };
        /**
         * 更换武将
         */
        AwayKeyboardView.prototype.changeGeneral1 = function () {
            this.recovery();
            //自己武将
            var actlist = ConstUtil.getStringArray(IConstEnum.HANG_ACTLIST);
            var generalVo = GeneralModel.getGeneralHightNearAtk();
            var generalId = 0;
            if (generalVo) {
                generalId = generalVo.generalId;
            }
            else {
                generalId = ConstUtil.getValue(IConstEnum.HANG_NO_GENERAL_DEFINE);
            }
            var modelId = GeneralModel.getGeneralConfig(generalId).ourModelCode;
            for (var i in actlist) {
                actlist[i] = modelId + actlist[i];
            }
            var imgList = this.m_effectMC.setSlotDisplayList("square1_general", actlist, 211, 211);
            this.m_generalImg = this.m_generalImg.concat(imgList);
            this.m_enemyGenList = PatrolModel.getRandomEnemyList();
            //敌方武将
            var eActlist = ConstUtil.getStringArray(IConstEnum.HANG_E_ACTLIST);
            for (var i = 2; i <= 4; i++) {
                var mId = 0;
                var tempList = [];
                mId = GeneralModel.getGeneralConfig(this.m_enemyGenList[i - 2]).ourModelCode;
                for (var i_1 in eActlist) {
                    tempList[i_1] = mId + eActlist[i_1];
                }
                var imgList_1 = this.m_effectMC.setSlotDisplayList("square" + i + "_general", tempList, 211, 211);
                this.m_generalImg = this.m_generalImg.concat(imgList_1);
            }
            this.changeSquare1_soldier();
            this.changeSquare2_soldier();
            this.changeHP(); //飘血替换
            this.changeGCC();
        };
        /**飘血替换 */
        AwayKeyboardView.prototype.changeHP = function () {
            var generalVo = GeneralModel.getGeneralHightNearAtk();
            for (var i = 1; i <= 15; i++) {
                var txt = new egret.BitmapText(); //ObjectPool.pop(egret.BitmapText,"egret.BitmapText");
                txt.letterSpacing = -6;
                txt.font = RES.getRes("hurtNumber_fnt");
                if (generalVo) {
                    txt.text = Math.floor(-1 * generalVo.getGenAttriValByType(AttriType.ATK) * Utils.RandomUtils.limit(0.9, 0.95)) + "";
                }
                else {
                    txt.text = Math.floor(-1 * 100 * Utils.RandomUtils.limit(0.9, 0.95)) + "";
                }
                txt.scaleX = txt.scaleY = 2;
                this.m_effectMC.setSlotDisplay("fly_blood_" + i, txt);
                this.m_bitmapTextList.push(txt);
            }
        };
        /**
         * 设置烽火图片
         */
        AwayKeyboardView.prototype.setFireImage = function () {
            var bigFire_imageList = ["DaFengHuo_000", "DaFengHuo_001", "DaFengHuo_002", "DaFengHuo_003", "DaFengHuo_004", "DaFengHuo_005"];
            var smallFire_imageList = ["XiaoFengHuo_000", "XiaoFengHuo_001", "XiaoFengHuo_002", "XiaoFengHuo_003", "XiaoFengHuo_004", "XiaoFengHuo_005"];
            this.m_effectMC.setSlotDisplayList("skill_1_position_8", bigFire_imageList, 134 * 2, 135 * 2);
            this.m_effectMC.setSlotDisplayList("skill_1_position_9", smallFire_imageList, 90 * 2, 100 * 2);
            this.m_effectMC.setSlotDisplayList("skill_1_position_10", smallFire_imageList, 90 * 2, 100 * 2);
        };
        /**
         * 设置炮弹图片
         */
        AwayKeyboardView.prototype.setFireStoneImage = function () {
            var fireStone_imageList = ["tsc_dd_0", "tsc_dd_1", "tsc_dd_2", "tsc_dd_3", "tsc_dd_4", "tsc_dd_5", "tsc_dd_6", "tsc_dd_7", "tsc_dd_8", "tsc_dd_9", "tsc_dd_10",
                "tsc_dd_11", "tsc_dd_12"];
            this.m_effectMC.setSlotDisplayList("Sprite_111", fireStone_imageList, 482, 456);
            this.m_effectMC.setSlotDisplayList("Sprite_11", fireStone_imageList, 482, 456);
            this.m_effectMC.setSlotDisplayList("Sprite_1", fireStone_imageList, 482, 456);
            this.m_effectMC.setSlotDisplayList("Sprite_112", fireStone_imageList, 482, 456);
        };
        /**
         * 更换技能图片
         */
        AwayKeyboardView.prototype.changeSkillImage = function () {
            var skill1_imageList = ConstUtil.getStringArray(IConstEnum.HANG_SKILL_1_IMAGE_LIST); //闪电
            var skill2_imageList = ConstUtil.getStringArray(IConstEnum.HANG_SKILL_2_IMAGE_LIST); //八卦
            var skill3_tuozhuai = ["tx1_0001", "tx1_0002", "tx1_0003", "tx1_0004", "tx1_0005", "tx1_0006", "tx1_0007", "tx1_0008", "tx1_0009", "tx1_0010"];
            var skill4_Yanyuezan = ["tx3_0001", "tx3_0002", "tx3_0003", "tx3_0004", "tx3_0005", "tx3_0006"];
            // let skill5_baguas = ["baguas_0","baguas_1","baguas_2","baguas_3","baguas_4","baguas_5",];
            var skill_1_start = ConstUtil.getStringArray(IConstEnum.HANG_SKILL_1_START);
            var skill_2_start = ConstUtil.getStringArray(IConstEnum.HANG_SKILL_2_START);
            // let imageList ;
            // let startImage ;
            // if(this.curIndex % 2 == 0){
            //     imageList = skill1_imageList;
            //     startImage = skill_1_start;
            // }else{
            //     imageList = skill2_imageList;
            //     startImage = skill_2_start;
            // }
            // for(let i in imageList){
            //     imageList[i] = imageList[i] + "_png";
            // }
            this.m_effectMC.setSlotDisplayList("skill_1_position_4", skill1_imageList, 769, 708); //闪电
            this.m_effectMC.setSlotDisplayList("skill_1_position_2", skill3_tuozhuai, 800, 800); //拖拽
            this.m_effectMC.setSlotDisplayList("skill_1_position_3", skill3_tuozhuai, 800, 800); //拖拽
            this.m_effectMC.setSlotDisplayList("skill_1_position_6", skill2_imageList, 800, 800); //八卦
            this.m_effectMC.setSlotDisplayList("skill_1_position_1", skill4_Yanyuezan, 486, 306); //偃月斩
            // this.m_effectMC.setSlotDisplayList("skill_1_position_5", skill5_baguas, 264, 352); //八卦起手动作
            // this.curIndex += 1;
            // if(this.curIndex == 3){
            //     this.curIndex = 0;
            // }
        };
        AwayKeyboardView.prototype.getImageList = function (index) {
            var soldierType = GeneralModel.getGeneralConfig(this.m_enemyGenList[index]).generalOccupation;
            if (soldierType == SoldierMainType.FOOTSOLDIER) {
                return ConstUtil.getStringArray(IConstEnum.HANG_SOLDIER_2);
            }
            else if (soldierType == SoldierMainType.RIDESOLDIER) {
                return ConstUtil.getStringArray(IConstEnum.HANG_SOLDIER_1);
            }
            else {
                return ConstUtil.getStringArray(IConstEnum.HANG_SOLDIER_2);
            }
        };
        AwayKeyboardView.prototype.changeSquare1_soldier = function () {
            var imageList = ["1004_1_a_0", "1004_1_a_1", "1004_1_a_2", "1004_1_a_3", "1004_1_a_4",
                "1004_1_s_0", "1004_1_s_1", "1004_1_s_2", "1004_1_s_3",
                "1004_7_w_0", "1004_7_w_1", "1004_7_w_2", "1004_7_w_3", "1004_7_w_4", "1004_7_w_5",
                "1004_1_w_0", "1004_1_w_1", "1004_1_w_2", "1004_1_w_3", "1004_1_w_4"];
            for (var i = 1; i <= 4; i++) {
                var imgList = this.m_effectMC.setSlotDisplayList("squaer1_soldier_" + i, imageList, 150, 150);
                this.m_generalImg = this.m_generalImg.concat(imgList);
            }
        };
        AwayKeyboardView.prototype.changeSquare2_soldier = function () {
            for (var i = 1; i <= 5; i++) {
                var imgList1 = this.m_effectMC.setSlotDisplayList("squaer2_soldier_" + i, this.getImageList(0), 150, 150);
                var imgList2 = this.m_effectMC.setSlotDisplayList("squaer4_soldier_" + i, this.getImageList(2), 150, 150);
                this.m_generalImg = this.m_generalImg.concat(imgList1);
                this.m_generalImg = this.m_generalImg.concat(imgList2);
            }
            for (var i = 1; i <= 4; i++) {
                var imgList = this.m_effectMC.setSlotDisplayList("squaer3_soldier_" + i, this.getImageList(1), 150, 150);
                this.m_generalImg = this.m_generalImg.concat(imgList);
            }
        };
        /**攻城车图片 */
        AwayKeyboardView.prototype.changeGCC = function () {
            var imageList = ["3007_7_a_0", "3007_7_a_1", "3007_7_a_2", "3007_7_a_3", "3007_7_a_4", "3007_7_a_5", "3007_7_a_6", "3007_7_a_7",
                "3007_7_d_0", "3007_7_d_1", "3007_7_d_2", "3007_7_d_3", "3007_7_d_4", "3007_7_d_5", "3007_7_a_0",
                "3007_7_w_0", "3007_7_w_1", "3007_7_w_2", "3007_7_w_3", "3007_7_w_4",];
            for (var i = 1; i <= 3; i++) {
                this.m_effectMC.setSlotDisplayList("squaer5_soldier_" + i, imageList, 208, 208);
            }
        };
        /**武将冲刺 */
        AwayKeyboardView.prototype.changeGeneralCC = function () {
            var imageList = ["qbcf3_0", "qbcf3_1", "qbcf3_2", "qbcf3_3", "qbcf3_4", "qbcf3_5", "qbcf3_6", "qbcf3_7", "qbcf3_8", "qbcf3_9", "qbcf3_10", "qbcf3_11",
                "qbcf7_9", "qbcf7_8", "qbcf7_7", "qbcf7_6", "qbcf7_5", "qbcf7_4", "qbcf7_3", "qbcf7_2", "qbcf7_11", "qbcf7_10", "qbcf7_1", "qbcf7_0",
            ];
            this.m_effectMC.setSlotDisplayList("skill_1_position_0", imageList, 208, 208);
        };
        AwayKeyboardView.prototype.randomGeneral = function () {
            var ran = Math.random();
            if (ran < 0.5) {
                var general = this.getFreeGeneral();
            }
        };
        AwayKeyboardView.prototype.getFreeGeneral = function () {
            function getGeneralInfo() {
                var playerInfo = PatrolModel.getRandomGeneral();
                if (!playerInfo) {
                    return;
                }
                var routeId = RandomUtils.getInstance().limitInteger(1, 4);
                var generalList = ConstUtil.getNumArray(IConstEnum.HANG_GENERAL_LIST);
                var ran = RandomUtils.getInstance().limitInteger(0, generalList.length - 1);
                var gId = GeneralModel.getGeneral(generalList[ran]).config.ourModelCode;
                return { routeId: routeId, gId: gId, playerInfo: playerInfo };
            }
            var info = getGeneralInfo();
            if (!info) {
                return;
            }
            for (var i in this.randomGeneralList) {
                var general = this.randomGeneralList[i];
                if (!general.isFree() && info.playerInfo == general.m_data.playerInfo) {
                    return;
                }
            }
            if (!this.randomGeneralList[1]) {
                var eff1 = new com_main.RandomGeneralEffect(info);
                this.randomGeneralList[1] = eff1;
                this.m_effectMC.setSlotDisplay("walk_general_1", eff1);
                return eff1;
            }
            if (!this.randomGeneralList[2]) {
                var eff2 = new com_main.RandomGeneralEffect(info);
                this.randomGeneralList[2] = eff2;
                this.m_effectMC.setSlotDisplay("walk_general_2", eff2);
                return eff2;
            }
            for (var i in this.randomGeneralList) {
                var general = this.randomGeneralList[i];
                if (general.isFree()) {
                    general.initByGid(info);
                    return general;
                }
            }
        };
        AwayKeyboardView.prototype.frame_event = function (evt) {
            for (var i = 1; i <= 2; i++) {
                for (var k = 1; k <= 4; k++) {
                    if (evt.frameLabel == "awardEvent" + i + k) {
                        //怪物死亡事件
                        var p = this.position[i][k];
                        com_main.EventMgr.dispatchEvent(PatrolEvent.PATROL_KILL_MONSTER, new egret.Point(this.effectNode.x + p.x - 50, this.effectNode.y + p.y - 30));
                    }
                }
            }
        };
        AwayKeyboardView.NAME = 'AwayKeyboardView';
        return AwayKeyboardView;
    }(com_main.CView));
    com_main.AwayKeyboardView = AwayKeyboardView;
})(com_main || (com_main = {}));
