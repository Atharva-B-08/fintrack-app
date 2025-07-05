// BulkDeleteRequest.java
package com.fintrack.dto;

import java.util.List;

public class BulkDeleteRequest {
    private List<Long> transactionIds;

    public List<Long> getTransactionIds() {
        return transactionIds;
    }

    public void setTransactionIds(List<Long> transactionIds) {
        this.transactionIds = transactionIds;
    }
}
