<div id="taskFlowActionAdvancePanel">
    <span class="add-ico"></span>高级配置<div class="solid"></div>
    <table class="form" cellpadding="0" cellspacing="0">
        <tr>
            <th>
                流转条件：
            </th>
            <td>
                <textarea id="taskFlowActionCondition" class="textarea"></textarea>
            </td>
        </tr>
        <tr>
            <th>
                代表配置：
            </th>
            <td style="padding-top: 10px;">
                范围：
                <select id="taskFlowActionAdvanceRange">
                    <option value=""></option>
                    <option value="Org">本单位</option>
                    <option value="OU1">1级部门</option>
                    <option value="OU2">2级部门</option>
                    <option value="OU3">3级部门</option>
                </select>
                <br/>
                环节：
                <div class="eCooeModel-all-tasks">
                    <input id="taskFlowActionAdvanceTask" type="text" class="input eCooeModel-all-tasks-advance-input" readonly=""/>
                    <span id="taskFlowActionAdvanceTaskPanel" class="fn-none eCooeModel-all-tasks-advance-panel">
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
                <select id="taskFlowActionBefore"></select>
                <br/>
                操作执行后：
                <select id="taskFlowActionAfter"></select>
            </td>
        </tr>
    </table>
</div>
