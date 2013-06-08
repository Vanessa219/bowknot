<div id="taskFlowActionPanel">
    <span class="add-ico"></span>基本配置<div class="solid"></div>
    <table class="form" cellpadding="0" cellspacing="0">
        <tr>
            <th>
                操作名称：
            </th>
            <td>
                <input type="text" class="input" id="taskFlowActionName"/>
            </td>
        </tr>
        <tr>
            <th>
                操作说明：
            </th>
            <td>
                <input type="text" class="input" id="taskFlowActionDesc"/>
            </td>
        </tr>
        <tr>
            <th>
                操作类型：
            </th>
            <td style="line-height: 25px; padding-top: 10px;">
                <div>
                    <input checked="checked" value="SelSend" type="radio" name="taskFlowActionType"/>选人发送
                    <input value="AutoSend" type="radio" name="taskFlowActionType"/>自动发送
                </div>
                <div>
                    过滤规则：
                    <select id="taskFlowActionFilter">
                        <option value=""></option>
                        <option value="OU1">当前办理人的1级部门</option>
                        <option value="OU2">当前办理人的2级部门</option>
                        <option value="OU3">当前办理人的3级部门</option>
                    </select>
                    <br/>
                    选择方式：
                    <select id="taskFlowActionChooseType">
                        <option value="Single">单选</option>
                        <option value="Multiple">多选</option>
                    </select>
                    <br/>
                    选择对象：
                    <input value="User" type="radio" name="taskFlowActionChooseNode"/> 人员
                    <input value="OU1" type="radio" name="taskFlowActionChooseNode"/> 1级部门
                    <input value="OU2" type="radio" name="taskFlowActionChooseNode"/> 2级部门
                    <input value="OU3" type="radio" name="taskFlowActionChooseNode"/> 3级部门
                    <br/>
                    显示规则：
                    <input value="" type="radio" name="taskFlowActionShowLevel"/> 无&nbsp;&nbsp;&nbsp;
                    <input value="OU1" type="radio" name="taskFlowActionShowLevel"/> 1级部门
                    <input value="OU2" type="radio" name="taskFlowActionShowLevel"/> 2级部门
                    <input value="OU3" type="radio" name="taskFlowActionShowLevel"/> 3级部门
                </div>
                <div class="fn-none">
                    发送规则：
                    <select id="taskFlowActionSendRule">
                        <option value=""></option>
                        <option value="Sender">当前办理人的发送人</option>
                        <option value="OU1">当前办理人的1级部门</option>
                        <option value="OU2">当前办理人的2级部门</option>
                        <option value="OU3">当前办理人的3级部门</option>
                    </select>
                </div>
            </td>
        </tr>
        <tr>
            <th>
                触发模式：
            </th>
            <td>
                <select id="taskFlowActionActivationMode">
                    <option selected="selected" value="EachTime">每次触发</option>
                    <option value="LastTime">末次触发</option>
                    <option value="Complex">复杂触发</option>
                </select>
                <span class="fn-none eCooeModel-all-tasks">
                    范围：
                    <select id="taskFlowActionRange">
                        <option value="Org">本单位</option>
                        <option value="OU1">1级部门</option>
                        <option value="OU2">2级部门</option>
                        <option value="OU3">3级部门</option>
                    </select>
                    环节：
                    <input id="taskFlowActionTask" type="text" class="input eCooeModel-all-tasks-input" readonly=""/>
                    <span id="taskFlowActionTaskPanel" class="eCooeModel-all-tasks-panel fn-none">
                        <ul></ul>
                        <span>
                            <button class="button">确定</button>
                            <button class="button">取消</button>
                        </span>
                    </span>
                </span>
            </td>
        </tr>
        <tr>
            <th>
                触发步骤：
            </th>
            <td>
                <select style="margin-top: 7px;" id="taskFlowActionTargetStep"><option value=""></option></select>
            </td>
        </tr>
    </table>
</div>
