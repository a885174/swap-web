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
package org.springblade.modules.solution.service.impl;

import org.springblade.modules.solution.entity.Solution;
import org.springblade.modules.solution.vo.SolutionVO;
import org.springblade.modules.solution.mapper.SolutionMapper;
import org.springblade.modules.solution.service.ISolutionService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;
import com.baomidou.mybatisplus.core.metadata.IPage;

/**
 * 故障解决方案  服务实现类
 *
 * @author Blade
 * @since 2020-05-04
 */
@Service
public class SolutionServiceImpl extends ServiceImpl<SolutionMapper, Solution> implements ISolutionService {

	@Override
	public IPage<SolutionVO> selectSolutionPage(IPage<SolutionVO> page, SolutionVO solution) {
		return page.setRecords(baseMapper.selectSolutionPage(page, solution));
	}

}
