/* 参考文献 */
/* コピペOK！】ON/OFFスイッチのデザイン７個｜iOS風スイッチもあるよ！ */
/* https://hajimete.org/on-off-switch-design-7 */

document.querySelectorAll('.toggle').forEach(function(toggle) {
    toggle.addEventListener('click', function() {
        // .toggle クラスを持つ要素に checked クラスをトグルする
        toggle.classList.toggle('checked');
        
        // チェックボックスのチェック状態をトグルする
        const input = toggle.querySelector('input[name="check"]');
        if (!input.checked) {
            input.checked = true;
        } else {
            input.checked = false;
        }
    });
});