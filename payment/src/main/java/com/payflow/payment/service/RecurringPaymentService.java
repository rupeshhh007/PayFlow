package com.payflow.payment.service;

import com.payflow.payment.model.RecurringPayment;
import com.payflow.payment.repository.RecurringPaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecurringPaymentService {

    private final RecurringPaymentRepository recurringRepo;
    private final WalletService walletService;

    @Scheduled(fixedRate = 10000)
    public void processRecurringPayments() {

        List<RecurringPayment> payments =
                recurringRepo
                        .findByActiveTrueAndNextPaymentDateBefore(
                                LocalDateTime.now()
                        );

        for (RecurringPayment rp : payments) {

            try {

                walletService.transfer(
                        rp.getSender().getEmail(),
                        rp.getReceiver().getEmail(),
                        rp.getAmount()
                );

                updateNextPaymentDate(rp);

                recurringRepo.save(rp);

            } catch (Exception e) {

                System.out.println(
                        "Recurring payment failed: "
                                + e.getMessage()
                );
            }
        }
    }

    private void updateNextPaymentDate(
            RecurringPayment rp
    ) {

        switch (rp.getFrequency()) {

            case "DAILY" ->
                    rp.setNextPaymentDate(
                            rp.getNextPaymentDate()
                                    .plusDays(1)
                    );

            case "WEEKLY" ->
                    rp.setNextPaymentDate(
                            rp.getNextPaymentDate()
                                    .plusWeeks(1)
                    );

            case "MONTHLY" ->
                    rp.setNextPaymentDate(
                            rp.getNextPaymentDate()
                                    .plusMonths(1)
                    );
        }
    }
}
