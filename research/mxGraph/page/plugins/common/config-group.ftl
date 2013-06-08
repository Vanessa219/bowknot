<table class="form" cellpadding="0" cellspacing="0">
    <tr>
        <th>
            分组策略：
        </th>
        <td>
            <input checked="checked" name="flowCommentsBaseGrouped" type="radio" value="false"/> 不分组
            <input name="flowCommentsBaseGrouped" type="radio" value="true" /> 分组
        </td>
    </tr>
    <tr>
        <th>
            分组起始层级：
        </th>
        <td>
            <select disabled="disabled" id="flowCommentsBaseTopLevel">
                <option value="OU1">1级部门</option>
                <option value="OU2">2级部门</option>
                <option value="OU3">3级部门</option>
            </select>
        </td>
    </tr>
    <tr>
        <th>
            分组终止层级：
        </th>
        <td>
            <select disabled="disabled" id="flowCommentsBaseBottomLevel">
                <option value="OU1">1级部门</option>
                <option value="OU2">2级部门</option>
                <option value="OU3">3级部门</option>
            </select>
        </td>
    </tr>
    <tr>
        <th>
            分组排序：
        </th>
        <td>
             <select disabled="disabled" id="flowCommentsBaseSort">
                <option value="onCommentTime">填写时间</option>
                <option value="onOrganUnitSort">组织机构</option>
            </select>
        </td>
    </tr>
</table>