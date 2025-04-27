<?php
function calculerNiveau($points) {
    if ($points >= 35) {
        return 'expert';
    } elseif ($points >= 20) {
        return 'avance';
    } elseif ($points >= 10) {
        return 'intermediaire';
    } else {
        return 'debutant';
    }
}
?>
