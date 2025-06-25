<?php
 
namespace Tests\Feature;
 
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;
use App\Mail\DemoEmail;
 
class DemoEmailTest extends TestCase
{
    use DatabaseTransactions;
    use WithFaker;
 
    /** @test */
    public function test_demo_email_is_sent_successfully()
    {
        // Arrange
        Mail::fake();
 
        $recipientEmail = 'haufsteven@gmail.com';
        $email = new DemoEmail();
 
        // Act
        Mail::to($recipientEmail)->send($email);
 
        // Assert
        Mail::assertSent(DemoEmail::class, function ($mail) use ($recipientEmail) {
            return $mail->hasTo($recipientEmail);
        });
    }
}