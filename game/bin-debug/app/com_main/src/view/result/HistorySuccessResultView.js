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
var com_main;
(function (com_main) {
    var HistorySuccessResultView = /** @class */ (function (_super_1) {
        __extends(HistorySuccessResultView, _super_1);
        function HistorySuccessResultView(args) {
            var _this = _super_1.call(this) || this;
            _this.name = HistorySuccessResultView.NAME;
            _this.initApp("battle_new/result/guanka_result_view.exml");
            _this.m_rewards = args.rewards;
            _this.star = args.star;
            _this.condition = args.condition;
            _this.gkId = args.gkId;
            _this.m_battleType = CheckPointType.HISTORY_WAR;
            return _this;
        }
        HistorySuccessResultView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.group_all.scaleX = GameConfig.getBestScale();
            this.group_all.scaleY = GameConfig.getBestScale();
            this.labelGray1.text = GLan(C.HistoryWarStarConfig[this.gkId].oneStarConfig);
            this.labelGray2.text = this.label0.text = GLan(C.HistoryWarStarConfig[this.gkId].twoStarConfig);
            this.labelGray3.text = this.label1.text = GLan(C.HistoryWarStarConfig[this.gkId].threeStarConfig);
            this.refreshReward(this.m_rewards);
            this.actionGroup.addEventListener("complete", this.wordFlyActionComplete, this);
            // this.actionGroup.addEventListener("itemComplete", this.onTweenItemComplete, this);
            this.star1Action.addEventListener("complete", this.starActionComplete, this);
            this.star2Action.addEventListener("complete", this.starActionComplete, this);
            this.star3Action.addEventListener("complete", this.starActionComplete, this);
            this.actionGroup.play();
            _super_1.prototype.addEvent.call(this);
            this.showSingleBtn();
        };
        HistorySuccessResultView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.actionGroup.removeEventListener("complete", this.wordFlyActionComplete, this);
            // this.actionGroup.removeEventListener("itemComplete", this.onTweenItemComplete, this);
            this.star1Action.removeEventListener("complete", this.starActionComplete, this);
            this.star2Action.removeEventListener("complete", this.starActionComplete, this);
            this.star3Action.removeEventListener("complete", this.starActionComplete, this);
        };
        HistorySuccessResultView.prototype.refreshReward = function (rewards) {
            // let reward = rewards;
            var reward = PropModel.filterItemList(rewards);
            for (var key in reward) {
                if (reward.hasOwnProperty(key)) {
                    var element = reward[key];
                    var itemId = element.itemId;
                    var baseType = element.baseType;
                    var count = element.count;
                    var item = com_main.ComItemNew.create("name_num");
                    item.setItemInfo(itemId, count);
                    this.group_itemList.addChild(item);
                }
            }
        };
        HistorySuccessResultView.prototype.wordFlyActionComplete = function () {
            if (this.star == 1) {
                this.star1Action.play();
            }
            else if (this.star == 2) {
                this.star2Action.play();
            }
            else if (this.star == 3) {
                this.star3Action.play();
            }
            else {
                this.itemAndbtnAction1.play();
            }
        };
        HistorySuccessResultView.prototype.starActionComplete = function () {
            this.itemAndbtnAction.play();
        };
        HistorySuccessResultView.NAME = "HistorySuccessResultView";
        return HistorySuccessResultView;
    }(com_main.ResultView));
    com_main.HistorySuccessResultView = HistorySuccessResultView;
})(com_main || (com_main = {}));
