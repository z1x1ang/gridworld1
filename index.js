//定义网格布局
let varray = Array(2).fill(0).map(() => Array(3).fill(0));
let array = Array(5).fill(0)


//
let cells = [1, 2, 3, 4, 5, 6];

// 使用math.js的函数求解
function solveLinearSystem(A, b) {
    const matrixA = math.matrix(A);
    const matrixB = math.matrix(b);
    let result = math.lusolve(matrixA, matrixB);
  
    //将结果映射为固定精度的数字，然后将它们解析为浮点数 这有助于避免浮点运算问题
    result = result.map(function (value) {
       // 精度可以调整以匹配预期的结果
        return parseFloat(value.toFixed(14));
    });
    return result;
  }
 
  // 定义系数矩阵A和向量b
  const A = [
    [-2, 1, 1, 0, 0],
    [1, -3, 0, 1, 0],
    [1, 0, -2, 1, 0],
    [0, 1, 1, -3, 1],
    [0, 0, 0, 1, -2]
  ];
  const b = [4, 4, 4, 4, 4];
  
  // 调用函数求解
  const V = solveLinearSystem(A, b);
  //插入终点位置
  V._data.splice(2,0,[0]);


  console.log(V._data.slice(0, 3))// 这应该会给出和原生JavaScript类似的结果
  for(let i=0; i<2; i++){
    varray[i]=V._data.flat().slice(i*3, i*3+3);
}
 //定义网格
 console.log(varray);


 //放置起点
 document.getElementById('startButton').addEventListener('click', function() {
  for (let i = 0; i < cells.length; i++) {
    let cell = document.getElementById('cell' + cells[i]);
    cell.addEventListener('mouseover', function() {
      if (this.id !== 'cell3') {
        this.style.backgroundColor = 'rgba(255,255,255,0.6)';
        //console.log(typeof this.textContent)
      }
    });
    cell.addEventListener('mouseout', function() {
      if (this.id !== 'cell3') {
        this.style.backgroundColor = '';
      }
    });
    cell.addEventListener('click',function(){
      console.log(this.id.match(/\d+/)[0]-1)
      route(this.id.match(/\d+/)[0]-1)
    })
  }
});
function route(id) {
  // 确保 id 在有效范围内
  if (id < 0 || id >= 6) return;

  // 如果 id 等于 2，终止递归
  if (id == 2) return;

  let values = [
    varray[Math.floor(id / 3) - 1]?.[id % 3], // 上
    varray[Math.floor(id / 3) + 1]?.[id % 3], // 下
    varray[Math.floor(id / 3)]?.[id % 3 - 1], // 左
    varray[Math.floor(id / 3)]?.[id % 3 + 1]  // 右
  ];

  // 根据位置调整值为 -100 或保留原值
  values[0] = Math.floor(id / 3) - 1 < 0 ? -100 : values[0];
  values[1] = Math.floor(id / 3) + 1 > 1 ? -100 : values[1];
  values[2] = id % 3 - 1 < 0 ? -100 : values[2];
  values[3] = id % 3 + 1 > 2 ? -100 : values[3];

  // 找出最大值及其索引
  let max = Math.max(...values);
  let maxIndex = values.indexOf(max);

  // 通过 maxIndex 确定目标单元格
  let targetId;
  switch (maxIndex) {
    case 0:
      targetId = id - 3;
      break;
    case 1:
      targetId = id + 3;
      break;
    case 2:
      targetId = id - 1;
      break;
    case 3:
      targetId = id + 1;
      break;
  }

  // 改变对应单元格的背景色
  let targetCell = document.getElementById('cell' + (targetId + 1));
  if (targetCell) {
    targetCell.style.backgroundColor = 'rgba(255,255,255,0.6)';
  }

  console.log("max是" + max + ", 下标是" + maxIndex);

  // 递归调用下一个单元格
  route(targetId);
}


document.getElementById('showValue').addEventListener('click', function() {
  varrayFlat = varray.flat(); // 确保 varray 已经被扁平化
  for (let index = 0; index < cells.length; index++) {
    // 使用 varrayFlat 来访问每个解
    document.getElementById('cell' + cells[index]).textContent = varrayFlat[index];
  }
  const text=document.getElementById('text')
  text.innerHTML="使用公式:$$V_{\\pi}(s)=\\sum_{a\\in A}{\\pi(a|s)(R^a_s+\\gamma \\sum_{s'\\in S}P_{ss'}^aV_{\\pi}(s'))}$$\
  方程组如下(\\(V(0,0)=V_1\\)...)<br>\
  V(0,0)=0.25(−1+V(0,0))+0.25(−1+V(0,0))+0.25(−1+V(0,1))+0.25(−1+V(1,0))<br>\
  V(0,1)=0.25×(−1+V(0,0))+0.25×(−1+V(0,1))+0.25×(−1+0)+0.25×(−1+V(1,1))<br>\
  V(1,0)=0.25(−1+V(0,0))+0.25(−1+V(1,0))+0.25(−1+V(1,0))+0.25(−1+V(1,1))<br>\
  V(1,1)=0.25(−1+V(1,0))+0.25(−1+V(0,1))+0.25(−1+V(1,2))+0.25(−1+V(1,1))<br>\
  V(1,2)=0.25(−1+0)+0.25(−1+V(1,1))+0.25(−1+V(1,2))+0.25(−1+V(1,2))<br>\
  点击放置起点按钮，鼠标移动到网格上再点击，此时智能体会找到一条消耗最少的路径"
   // 这行代码告诉 MathJax 重新渲染页面上的所有数学公式，包括刚刚添加的
   MathJax.typesetPromise([text])
});
