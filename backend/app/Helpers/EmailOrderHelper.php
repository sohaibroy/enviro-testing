<?php

namespace App\Helpers;

use App\Models\Orders;

class EmailOrderHelper
{
    public static function loadFullOrder(int $orderId): Orders
    {
        return Orders::with([
            'orderDetails.method.analyte',
            'equipmentItems',
        ])->findOrFail($orderId);
    }
}