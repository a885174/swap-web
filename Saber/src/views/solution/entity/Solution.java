/**
 * Copyright (c) 2018-2028, Chill Zhuang 庄骞 (smallchill@163.com).
 * <p>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.springblade.modules.solution.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import java.time.LocalDateTime;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * 故障解决方案 实体类
 *
 * @author Blade
 * @since 2020-05-04
 */
@Data
@TableName("swap_solution")
@ApiModel(value = "Solution对象", description = "故障解决方案 ")
public class Solution implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键id
     */
    @ApiModelProperty(value = "主键id")
    private Integer faultId;
    /**
     * 故障编号
     */
    @ApiModelProperty(value = "故障编号")
    private String faultCode;
    /**
     * 故障类型1：电动车  2：电池
     */
    @ApiModelProperty(value = "故障类型1：电动车  2：电池")
    private String faultType;
    /**
     * 故障代码
     */
    @ApiModelProperty(value = "故障代码")
    private String faultKey;
    /**
     * 故障值
     */
    @ApiModelProperty(value = "故障值")
    private String faultValue;
    /**
     * 故障名称
     */
    @ApiModelProperty(value = "故障名称")
    private String faultName;
    /**
     * 解决方案
     */
    @ApiModelProperty(value = "解决方案")
    private String faultSolution;
    /**
     * 创建人
     */
    @ApiModelProperty(value = "创建人")
    private String createUser;
    /**
     * 创建时间
     */
    @ApiModelProperty(value = "创建时间")
    private LocalDateTime createTime;
    /**
     * 更新人
     */
    @ApiModelProperty(value = "更新人")
    private String updateUser;
    /**
     * 更新时间
     */
    @ApiModelProperty(value = "更新时间")
    private LocalDateTime updateTime;


}
