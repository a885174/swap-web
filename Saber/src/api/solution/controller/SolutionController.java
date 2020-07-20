/**
 * Copyright (c) 2018-2028, Chill Zhuang 庄骞 (smallchill@163.com).
 * <p>
 * Licensed under the GNU LESSER GENERAL PUBLIC LICENSE 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * http://www.gnu.org/licenses/lgpl.html
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.springblade.modules.solution.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperationSupport;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.AllArgsConstructor;
import javax.validation.Valid;

import org.springblade.core.mp.support.Condition;
import org.springblade.core.mp.support.Query;
import org.springblade.core.tool.api.R;
import org.springblade.core.tool.utils.Func;
import org.springframework.web.bind.annotation.*;
import com.baomidou.mybatisplus.core.metadata.IPage;
import org.springblade.modules.solution.entity.Solution;
import org.springblade.modules.solution.vo.SolutionVO;
import org.springblade.modules.solution.service.ISolutionService;
import org.springblade.core.boot.ctrl.BladeController;

/**
 * 故障解决方案  控制器
 *
 * @author Blade
 * @since 2020-05-04
 */
@RestController
@AllArgsConstructor
@RequestMapping("swap_solution/solution")
@Api(value = "故障解决方案 ", tags = "故障解决方案 接口")
public class SolutionController extends BladeController {

	private ISolutionService solutionService;

	/**
	 * 详情
	 */
	@GetMapping("/detail")
	@ApiOperationSupport(order = 1)
	@ApiOperation(value = "详情", notes = "传入solution")
	public R<Solution> detail(Solution solution) {
		Solution detail = solutionService.getOne(Condition.getQueryWrapper(solution));
		return R.data(detail);
	}

	/**
	 * 分页 故障解决方案 
	 */
	@GetMapping("/list")
	@ApiOperationSupport(order = 2)
	@ApiOperation(value = "分页", notes = "传入solution")
	public R<IPage<Solution>> list(Solution solution, Query query) {
		IPage<Solution> pages = solutionService.page(Condition.getPage(query), Condition.getQueryWrapper(solution));
		return R.data(pages);
	}

	/**
	 * 自定义分页 故障解决方案 
	 */
	@GetMapping("/page")
	@ApiOperationSupport(order = 3)
	@ApiOperation(value = "分页", notes = "传入solution")
	public R<IPage<SolutionVO>> page(SolutionVO solution, Query query) {
		IPage<SolutionVO> pages = solutionService.selectSolutionPage(Condition.getPage(query), solution);
		return R.data(pages);
	}

	/**
	 * 新增 故障解决方案 
	 */
	@PostMapping("/save")
	@ApiOperationSupport(order = 4)
	@ApiOperation(value = "新增", notes = "传入solution")
	public R save(@Valid @RequestBody Solution solution) {
		return R.status(solutionService.save(solution));
	}

	/**
	 * 修改 故障解决方案 
	 */
	@PostMapping("/update")
	@ApiOperationSupport(order = 5)
	@ApiOperation(value = "修改", notes = "传入solution")
	public R update(@Valid @RequestBody Solution solution) {
		return R.status(solutionService.updateById(solution));
	}

	/**
	 * 新增或修改 故障解决方案 
	 */
	@PostMapping("/submit")
	@ApiOperationSupport(order = 6)
	@ApiOperation(value = "新增或修改", notes = "传入solution")
	public R submit(@Valid @RequestBody Solution solution) {
		return R.status(solutionService.saveOrUpdate(solution));
	}

	
	/**
	 * 删除 故障解决方案 
	 */
	@PostMapping("/remove")
	@ApiOperationSupport(order = 8)
	@ApiOperation(value = "删除", notes = "传入ids")
	public R remove(@ApiParam(value = "主键集合", required = true) @RequestParam String ids) {
		return R.status(solutionService.removeByIds(Func.toIntList(ids)));
	}

	
}
