<div style="margin: 10px;">
    <span class="add-ico"></span>基本配置<div class="solid"></div>
    <table class="form" cellpadding="0" cellspacing="0">
        <tr>
            <th>
                操作名称：
            </th>
            <td>
                <input type="text" class="input" id="sequenceName"/>
            </td>
        </tr>
        <tr>
            <th>
                操作说明：
            </th>
            <td>
                <input type="text" class="input" id="sequenceDesc"/>
            </td>
        </tr>
        <tr>
            <th>
                操作类型：
            </th>
            <td style="line-height: 25px; padding-top: 10px;">
                <div>
                    <input checked="checked" value="SelSend" type="radio" name="sequenceType"/>选人发送
                    <input value="AutoSend" type="radio" name="sequenceType"/>自动发送
                </div>
                <div>
                    过滤规则：
                    <select id="sequenceFilter">
                        <option value=""></option>
                        <option value="OU1">当前办理人的1级部门</option>
                        <option value="OU2">当前办理人的2级部门</option>
                        <option value="OU3">当前办理人的3级部门</option>
                    </select>
                    <br/>
                    选择方式：
                    <select id="sequenceChooseType">
                        <option value="Single">单选</option>
                        <option value="Multiple">多选</option>
                    </select>
                    <br/>
                    选择对象：
                    <input value="User" type="radio" name="sequenceChooseNode"/> 人员
                    <input value="OU1" type="radio" name="sequenceChooseNode"/> 1级部门
                    <input value="OU2" type="radio" name="sequenceChooseNode"/> 2级部门
                    <input value="OU3" type="radio" name="sequenceChooseNode"/> 3级部门
                    <br/>
                    显示规则：
                    <input value="" type="radio" name="sequenceShowLevel"/> 无&nbsp;&nbsp;&nbsp;
                    <input value="OU1" type="radio" name="sequenceShowLevel"/> 1级部门
                    <input value="OU2" type="radio" name="sequenceShowLevel"/> 2级部门
                    <input value="OU3" type="radio" name="sequenceShowLevel"/> 3级部门
                </div>
                <div class="fn-none">
                    发送规则：
                    <select id="sequenceSendRule">
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
                <select id="sequenceActivationMode">
                    <option selected="selected" value="EachTime">每次触发</option>
                    <option value="LastTime">末次触发</option>
                    <option value="Complex">复杂触发</option>
                </select>
                <span class="fn-none" style="position: relative">
                    范围：
                    <select id="sequenceRange">
                        <option value="Org">本单位</option>
                        <option value="OU1">1级部门</option>
                        <option value="OU2">2级部门</option>
                        <option value="OU3">3级部门</option>
                    </select>
                    环节：
                    <input id="sequenceTask" type="text" class="input eCooeModel-all-tasks-input" readonly=""/>
                    <span id="sequenceTaskPanel" class="fn-none eCooeModel-all-tasks-panel">
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
                <select style="margin-top: 7px;" id="sequenceTargetStep"><option value=""></option></select>
            </td>
        </tr>
    </table>
    <span class="add-ico"></span>高级配置<div class="solid"></div>
    <table class="form" cellpadding="0" cellspacing="0">
        <tr>
            <th>
                流转条件：
            </th>
            <td>
                <textarea id="sequenceCondition" class="textarea"></textarea>
            </td>
        </tr>
        <tr>
            <th>
                代表配置：
            </th>
            <td style="padding-top: 10px;">
                范围：
                <select id="sequenceAdvanceRange">
                    <option value=""></option>
                    <option value="Org">本单位</option>
                    <option value="OU1">1级部门</option>
                    <option value="OU2">2级部门</option>
                    <option value="OU3">3级部门</option>
                </select>
                <br/>
                环节：
                <div class="eCooeModel-all-tasks">
                    <input id="sequenceAdvanceTask" type="text" class="input eCooeModel-all-tasks-advance-input" readonly=""/>
                    <span id="sequenceAdvanceTaskPanel" class="fn-none eCooeModel-all-tasks-advance-panel">
                        <ul></ul>
                        <span>
                            <button class="button">确定</button>
                            <button class="button">取消</button>
                        </span>
                    </span>
                </div>
            </td>
        </tr>
        <tr>
            <th>
                触发事件：
            </th>
            <td style="padding-top: 10px;">
                操作执行前：
                <select id="sequenceBefore"></select>
                <br/>
                操作执行后：
                <select id="sequenceAfter"></select>
            </td>
        </tr>
    </table>

</div>

