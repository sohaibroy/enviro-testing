const { test, expect } = require('@playwright/test');

test('Navigation Analytes page test', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Query the first element using XPath expression
    const element = await page.locator('xpath=/html/body/main/div/div[2]/div/div[2]/div[1]').first();

    // Assert that the first element is found
    expect(element).not.toBeNull();

    // Click on the first element
    await element.click();

    // Wait for navigation to complete
    await page.waitForNavigation();

    // Get the final URL after clicking on the first element
    const methodUrl = page.url();

    // Assert that the final URL matches the expected URL
    expect(methodUrl).toBe('http://localhost:3000/method-selection/27');
});

test('Navigation Method page test', async ({ page }) => {
    await page.goto('http://localhost:3000/method-selection/27');
    // Query the second element using XPath expression
    const newElement = await page.locator('xpath=/html/body/main/div/div/div/div/div[1]/a').first();

    // Assert that the second element is found
    expect(newElement).not.toBeNull();

    // Click on the second element
    await newElement.click();

    // Wait for navigation to complete
    await page.waitForNavigation();

    // Get the final URL after clicking on the second element
    const finalUrl = page.url();

    // Assert that the final URL matches the expected URL
    expect(finalUrl).toBe('http://localhost:3000/quantity-selection/13');
});

test('Navigation Quantity and Estimate page test', async ({ page }) => {
    await page.goto('http://localhost:3000/quantity-selection/13');

    // Query the third element using XPath expression
    const thirdElement = await page.locator('xpath=/html/body/main/div/div/div/div/section[4]/button').first();

    // Assert that the third element is found
    expect(thirdElement).not.toBeNull();

    // Click on the third element
    await thirdElement.click();

    // Wait for navigation to complete
    await page.waitForNavigation();

    // Get the final URL after clicking on the third element
    const thirdUrl = page.url();

    // Assert that the final URL matches the expected URL
    expect(thirdUrl).toBe('http://localhost:3000/view-cart');
    const formData = {
        'firstName': 'Test',
        'lastName': 'Dummy',
        'email': 'adhikariprabin001@gmail.com',
        'phoneNumber': '1234567890',
        // Add more input fields as needed
    };

    // Fill the form fields
    for (const [fieldName, value] of Object.entries(formData)) {
        await page.fill(`xpath=/html/body/main/div/div/div/div[2]/form//input[@name='${fieldName}']`, value);
    }
    page.click('xpath=/html/body/main/div/div/div/div[2]/div/button'),

    await page.waitForSelector('xpath=/html/body/main/div/div/div/div/p[1]');

    // Get the text content of the success message element
    const successMessage = await page.textContent('xpath=/html/body/main/div/div/div/div/p[1]');

    // Verify that the success message is as expected
    expect(successMessage).toBe('Order has been placed!');

});
