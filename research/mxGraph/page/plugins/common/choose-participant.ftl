<div class="choose-user">
    <div>
        类型：
        <input type="radio" name="commonChooseUserType" value="1" checked="checked" /> 角色机构 
        <input type="radio" value="2" name="commonChooseUserType" /> 人员
    </div>
    <div class="left-panel">
        <div class="org-panel">
            选择角色：
            <input readonly="readonly" type="text" class="input commonChooseUserRole" style="width: 137px"/><button class="button commonChooseUserClearRole" style="float: right; padding: 3px 10px;">清空</button><span class="select-ico"></span>

            <div class="role-tree fn-none">
                <span class="add-ico"></span> ${groups.orgName}
                <ul>
                    <#list groups.groups as group>
                    <li data-code="${group.code}">${group.name}</li>
                    </#list>
                </ul>
            </div>
            选择机构：
            <div class="org-tree" style="width: 288px; margin-top: 5px; height: 276px;">
                <ul>
                    <#list units.units as unit>
                    <li data-code="${unit.unit.code}">
                        <span class="<#if unit.subUnits?size!=0>add-ico<#else>fn-blank</#if>"></span>
                        <input type="checkbox" /><font>${unit.unit.name}</font>
                    </li>
                    <#if unit.subUnits?size!=0>
                    <li class="no-list">
                        <ul>
                            <#list unit.subUnits as subUnit>
                            <li data-code="${subUnit.unit.code}">
                                <span class="<#if subUnit.subUnits?size!=0>plus-ico<#else>fn-blank</#if>"></span>
                                <input type="checkbox" /><font>${subUnit.unit.name}</font>
                            </li>

                            <#if subUnit.subUnits?size!=0>
                            <li class="no-list fn-none">
                                <ul>
                                    <#list subUnit.subUnits as item>
                                    <li data-code="${item.unit.code}">
                                        <input type="checkbox" /><font>${item.unit.name}</font>
                                    </li>
                                    </#list>
                                </ul>
                            </li>
                            </#if>
                            </#list>
                        </ul>
                    </li>
                    </#if>
                    </#list>
                </ul>
            </div>
        </div>   
        <div class="fn-none user-tree">
            <ul>
                <#list units.units as unit>
                <li data-code="${unit.unit.code}">
                    <span class="<#if unit.subUnits?size!=0 || unit.users?size!=0>add-ico<#else>fn-blank</#if>"></span><font>${unit.unit.name}</font>
                </li>

                <#if unit.subUnits?size!=0 || unit.users?size!=0>
                <li>
                    <ul>
                        <#if unit.subUnits?size!=0>
                        <li class="no-list">
                            <ul>
                                <#list unit.subUnits as subUnit>
                                <li data-code="${subUnit.unit.code}">
                                    <span class="<#if subUnit.subUnits?size!=0 || subUnit.users?size!=0>plus-ico<#else>fn-blank</#if>"></span><font>${subUnit.unit.name}</font>
                                </li>

                                <#if subUnit.subUnits?size!=0 || subUnit.users?size!=0>
                                <li class="no-list fn-none">
                                    <ul>
                                        <#if subUnit.subUnits?size!=0>
                                        <li>
                                            <ul>
                                                <#list subUnit.subUnits as thirdUnit>
                                                <li data-code="${thirdUnit.unit.code}">
                                                    <span class="<#if thirdUnit.users?size!=0 || thirdUnit.subUnits?size!=0>plus-ico<#else>fn-blank</#if>"></span><font>${thirdUnit.unit.name}</font>
                                                </li>

                                                <#if thirdUnit.users?size!=0 || thirdUnit.subUnits?size!=0>
                                                <li class="no-list fn-none">
                                                    <ul>
                                                        <#if thirdUnit.users??>
                                                        <#list thirdUnit.users as thirdUsers>
                                                        <li data-code="${thirdUsers.id}">
                                                            <input type="checkbox" /><font>${thirdUsers.name}</font>
                                                        </li>
                                                        </#list>
                                                        </#if>
                                                    </ul>
                                                </li>
                                                </#if>
                                                </#list>
                                            </ul>
                                        </li>
                                        </#if>

                                        <#if subUnit.users??>
                                        <#list subUnit.users as subUser>
                                        <li data-code="${subUser.id}">
                                            <input type="checkbox" /><font>${subUser.name}</font>
                                        </li>
                                        </#list>
                                        </#if>
                                    </ul>
                                </li>
                                </#if>

                                </#list>
                            </ul>
                        </li>
                        </#if>

                        <#if unit.users??>
                        <#list unit.users as user>
                        <li data-code="${user.id}">
                            <span class="fn-blank"></span>
                            <input type="checkbox" /><font>${user.name}</font>
                        </li>
                        </#list> 
                        </#if>

                    </ul>
                </li>
                </#if>
                </#list>
            </ul>
        </div>
    </div> 
    <div class="middle-panel">
        <button class="button">授权</button>
        <button class="button">排除</button>
        <button class="button">删除</button>
    </div>
    <div class="right-panel">
        <ul></ul>
    </div>

</div>