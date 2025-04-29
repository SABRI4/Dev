<?php
function calculerNiveau($points) {
    if ($points >= 15) {
        return 'expert';
    } elseif ($points >= 10) {
        return 'avance';
    } elseif ($points >=  5) {
        return 'intermediaire';
    } else {
        return 'debutant';
    }
}
?>
