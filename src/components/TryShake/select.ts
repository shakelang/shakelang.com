/*
// Look for any elements with the class "custom-select":

document.addEventListener('DOMContentLoaded', () => {

  const custom_selects = document.getElementsByClassName("custom-select");
  const len = custom_selects.length;
  for (let i = 0; i < len; i++) apply_to_select(custom_selects[i] as HTMLDivElement)

});
*/
export function apply_to_select(element: HTMLDivElement)  {
  const elmnt = element.getElementsByTagName("select")[0];
  const olen = elmnt.length;

  const selectElement0 = document.createElement("DIV");
  selectElement0.setAttribute("class", "select-selected");
  selectElement0.innerHTML = elmnt.options[elmnt.selectedIndex].innerHTML;
  element.appendChild(selectElement0);
  
  const selectElement1 = document.createElement("DIV");
  selectElement1.setAttribute("class", "select-items select-hide");
  for (let j = 1; j < olen; j++) {

    const selectEntry = document.createElement("DIV");
    selectEntry.innerHTML = elmnt.options[j].innerHTML;
    selectEntry.addEventListener("click", function(e) {
        /* When an item is clicked, update the original select box,
        and the selected item: */
        const s = (this.parentNode.parentNode as HTMLElement).getElementsByTagName("select")[0];
        const sl = s.length;
        const h = this.parentNode.previousSibling as HTMLElement;
        for (let i = 0; i < sl; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            const y = (this.parentNode as HTMLElement).getElementsByClassName("same-as-selected");
            const yl = y.length;
            for (let k = 0; k < yl; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
    });
    selectElement1.appendChild(selectEntry);
  }
  element.appendChild(selectElement1);
  selectElement0.addEventListener("click", function(e) {
    /* When the select box is clicked, close any other select boxes,
    and open/close the current select box: */
    e.stopPropagation();
    closeAllSelect(this);
    (this.nextSibling as HTMLElement).classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
  });
}

function closeAllSelect(elmnt: any) {
  /* A function that will close all select boxes in the document,
  except the current select box: */
  var x, y, i, xl, yl, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}

document.addEventListener("click", closeAllSelect);